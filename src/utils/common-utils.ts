/**
 * Get JavaScript basic data types
 * @param data
 * @returns {string} array | string | number ...
 */
export const getType = (data: string) => {
  const type = Object.prototype.toString.call(data).split(' ')[1]
  return type.substring(0, type.length - 1).toLowerCase()
}

/**
 * Gets a string(uuid) that is not repeated
 * @returns uuid {string}
 */
export const getUuid = () => {
  return Number(Math.random().toString().substr(2, 5) + Date.now()).toString(36)
}

/**
 * get localStorage value
 * @param key
 * @returns {*}
 */
export const getLocalItem = (key: string) => {
  const temp = window.localStorage.getItem(key)
  return temp ? JSON.parse(temp) : null
}

export const getExtensionFromUrl = (url) => url.match(/\.([^./?]+)($|\?)/)[1]

export const getUrlsFromHtml = (html) => {
  const urls = []
  const pattern = /<img[^>]+src="?([^"\s]+)"?.*\/?>/g
  let m = pattern.exec(html)
  // try max times at most, also avoid dead loop
  let max = 5
  while (m && max > 0) {
    if (m[1]) {
      max -= 1
      urls.push(m[1])
    }
    m = pattern.exec(html)
  }
  return urls
}

export const isValidUrl = (urlString) => {
  const urlPattern = new RegExp(
    '^(https?:\\/\\/)?' + // validate protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ) // validate fragment locator
  return !!urlPattern.test(urlString)
}

export const readFileFromUrl = (url) =>
  new Promise((resolve) => {
    if (!url || !isValidUrl(url)) resolve(null)
    try {
      // Opaque responses can't be accessed with JavaScript
      // see https://stackoverflow.com/questions/46641508/download-image-using-fetch-api
      fetch(url, {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Access-Control-Allow-Origin': '*'
        },
        mode: 'no-cors'
      })
        .then((res) => res.blob())
        .then((blob) => {
          const ext = getExtensionFromUrl(url)
          const file = new File([blob], `image.${ext}`, {
            type: `image/${ext}`
          })
          resolve(file)
        })
    } catch (error) {
      resolve(null)
    }
  })
