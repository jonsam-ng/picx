import selectedFileHandle from './selected-file-handle'
import { isValidUrl, readFileFromUrl, getUrlsFromHtml } from './common-utils'

const onPaste = (e: any, maxsize: number): Promise<any> | null => {
  if (!(e.clipboardData && e.clipboardData.items)) {
    return null
  }

  // eslint-disable-next-line consistent-return
  return new Promise((resolve) => {
    // eslint-disable-next-line no-plusplus
    for (let i = 0, len = e.clipboardData.items.length; i < len; i++) {
      const item = e.clipboardData.items[i]
      if (item.kind === 'file') {
        const pasteFile = item.getAsFile()

        selectedFileHandle(pasteFile, maxsize)?.then((result) => {
          if (!result) {
            return
          }
          const { base64, originalFile, compressFile } = result
          resolve({ base64, originalFile, compressFile })
        })
      } else if (item.kind === 'string') {
        // extract image from html like gif
        item.getAsString((pasteString) => {
          if (
            !pasteString ||
            !['<img', 'src='].every((s) => pasteString.indexOf(s) !== -1)
          )
            return
          // extract urls
          const urls = getUrlsFromHtml(pasteString)

          if (!urls || !urls.length) return
          urls.forEach(async (url) => {
            const file = await readFileFromUrl(url)
            console.log('==>', { file })
            if (!file) return
            // handle this file
            selectedFileHandle(file, maxsize)?.then((result) => {
              console.log('==>', { result })
              if (!result) return
              const { base64, originalFile, compressFile } = result
              resolve({ base64, originalFile, compressFile })
            })
          })
        })
      }
    }
  })
}

export default onPaste
