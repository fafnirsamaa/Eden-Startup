/**
 * Display formatting helpers.
 */

/** Format a pH value to one decimal */
export const formatPh = (v) => `pH ${Number(v).toFixed(1)}`

/** Format humidity as a percentage */
export const formatHumidity = (v) => `${Math.round(v)}%`

/** Format water level as a percentage */
export const formatWaterLevel = (v) => `${Math.round(v)}%`

/** Format temperature in °C */
export const formatTemp = (v) => `${Number(v).toFixed(1)} °C`

/** Format mineral concentration in mg/L */
export const formatMinerals = (v) => `${Math.round(v)} mg/L`

/** Format light in lux */
export const formatLight = (v) =>
  v >= 1000 ? `${(v / 1000).toFixed(1)} klx` : `${Math.round(v)} lx`

/** Relative time — "x days ago" or "just now" */
export function relativeTime(isoTimestamp) {
  const diff = Date.now() - new Date(isoTimestamp).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1)  return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24)   return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

/** Format price in euros */
export const formatPrice = (v) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(v)
