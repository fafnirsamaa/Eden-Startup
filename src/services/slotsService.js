import api from './api'

export const slotsService = {
  getAll:      ()           => api.get('/slots'),
  getById:     (id)         => api.get(`/slots/${id}`),
  updateOverride: (id, active) => api.patch(`/slots/${id}/override`, { active }),
}
