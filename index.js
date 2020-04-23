const VARIANTSAPI = 'https://cfw-takehome.developers.workers.dev/api/variants'

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with response from given variant url
 * @param {Request} request
 */
async function handleRequest(request) {
  const url = await fetchVariantURL()
  const URLResponse = await fetch(url)

  const titleHandler = new TitleHandler();
  const response = new HTMLRewriter()
    .on('title', titleHandler)
    .on('h1#title', titleHandler)
    .on('p#description', new DescriptionHandler())
    .on('a#url', new URLHandler())
    .transform(URLResponse)

  return response
}
/**
 * Fetches and returns random variant URL from Variants API ('https://cfw-takehome.developers.workers.dev/api/variants')
 * 
 */
async function fetchVariantURL() {
  const response = await fetch(VARIANTSAPI)
  const data = await response.json()
  const variants = data.variants

  return variants[(Math.random() < 0.5 ? 0 : 1)]
}

class TitleHandler {
  element(element) {
    element.prepend("Samantha Wiley -")
  }
}

class DescriptionHandler {
  element(element) {
    element.replace("Hi! I'm Samantha, and my mission is to develop solutions that bring joy and value to our community.")
  }
}

class URLHandler {
  element(element) {
    element.setAttribute('href', 'https://www.linkedin.com/in/samantha-wiley-597439154/')
    element.setInnerContent("Visit my LinkedIn profile")
  }
}

