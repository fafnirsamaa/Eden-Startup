/**
 * Unsplash placeholder image helpers.
 * Swap UNSPLASH_ACCESS_KEY via environment variable.
 */
const BASE = 'https://images.unsplash.com'

/**
 * Returns a sized Unsplash photo URL by keyword.
 * @param {string} query
 * @param {number} width
 * @param {number} height
 * @returns {string}
 */
export function unsplashUrl(query, width = 800, height = 600) {
  return `${BASE}/featured?${new URLSearchParams({ query, w: width, h: height, fit: 'crop', auto: 'format' })}`
}

/** Pre-resolved placeholder map for common plant assets */
export const PLANT_IMAGES = {
  tomato:    unsplashUrl('tomato plant', 400, 400),
  lettuce:   unsplashUrl('lettuce plant', 400, 400),
  basil:     unsplashUrl('basil herb', 400, 400),
  strawberry:unsplashUrl('strawberry plant', 400, 400),
  default:   unsplashUrl('green plant', 400, 400),
}
