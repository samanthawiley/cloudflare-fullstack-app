const VARIANTSAPI = 'https://cfw-takehome.developers.workers.dev/api/variants'

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with response from given variant url
 * @param {Request} request
 */
async function handleRequest(request) {
  let url = await fetchVariantURL()

  return await fetch(url)
}
/**
 * Fetches and returns random variant URL from Variants API ('https://cfw-takehome.developers.workers.dev/api/variants')
 * 
 */
async function fetchVariantURL() {
  let response = await fetch(VARIANTSAPI)
  let data = await response.json()
  let variants = data.variants

  return variants[(Math.random() < 0.5 ? 0 : 1)]
}

