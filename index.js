const VARIANTSAPI = 'https://cfw-takehome.developers.workers.dev/api/variants'

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Responds with customized variant
 * @param {Request} request
 */
async function handleRequest(request) {
  const cookie = getCookieURL(request)
  const url = cookie ? cookie : await fetchVariantURL()

  const URLResponse = await fetch(url)
  const response = customizeResponse(URLResponse)

  if (!cookie) {
    response.headers.set('Set-Cookie', `URL=${url}`)
  }

  return response
}

/**
 * Fetches random variant URL from Variants API ('https://cfw-takehome.developers.workers.dev/api/variants')
 */
async function fetchVariantURL() {
  const response = await fetch(VARIANTSAPI)
  const data = await response.json()
  const variants = data.variants

  return variants[(Math.random() < 0.5 ? 0 : 1)]
}

/**
 * Retrieves URL cookie from the request headers
 * @param {Request} request 
 */
function getCookieURL(request) {
  let url = null

  const cookieData = request.headers.get('Cookie')
  if (cookieData) {
    const cookies = cookieData.split(";")
    cookies.forEach((cookie) => {
      const cookieValues = cookie.split("=")

      const cookieName = cookieValues[0]
      if (cookieName === "URL") {
        url = cookieValues[1]
      }
    })
  }

  return url
}

/**
 * Customizes given response using HTMLRewriter
 * @param {Response} response 
 */
function customizeResponse(response) {
  const titleHandler = new TitleHandler();
  
  return new HTMLRewriter()
    .on('title', titleHandler)
    .on('h1#title', titleHandler)
    .on('p#description', new DescriptionHandler())
    .on('a#url', new CTAHandler())
    .transform(response)
}

/**
 * Element Handler for Title
 */
class TitleHandler {
  element(element) {
    element.prepend("Samantha Wiley -")
  }
}

/**
 * Element Handler for Description
 */
class DescriptionHandler {
  element(element) {
    element.replace("Hi! I'm Samantha, and my mission is to develop solutions that bring joy and value to our community.")
  }
}

/**
 * Element Handler for Call to Action
 */
class CTAHandler {
  element(element) {
    element.setAttribute('href', 'https://www.linkedin.com/in/samantha-wiley-597439154/')
    element.setInnerContent("Visit my LinkedIn profile")
  }
}

