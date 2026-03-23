import api from './api'

export const marketplaceService = {
  getProducts:  (category) => api.get('/products', { params: { category } }),
  getProduct:   (id)       => api.get(`/products/${id}`),
  addToCart:    (id, qty)  => api.post('/cart/items', { productId: id, quantity: qty }),
}
