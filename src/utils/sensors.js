/**
 * Sensor utilities — anomaly detection and status resolution.
 * The logic layer runs 5× per 24h (every ~4h48m).
 */

/** Normal operating ranges for each sensor metric */
export const SENSOR_RANGES = {
  humidity:    { min: 60, max: 85 },
  ph:          { min: 5.5, max: 7.0 },
  waterLevel:  { min: 20, max: 100 },
  temperature: { min: 16, max: 28 },
  light:       { min: 200, max: 60000 },
  minerals:    { min: 100, max: 1200 },
}

/**
 * Returns 'critical' | 'warning' | 'healthy' for a given metric value.
 * @param {keyof typeof SENSOR_RANGES} metric
 * @param {number} value
 * @returns {'critical'|'warning'|'healthy'}
 */
export function getMetricStatus(metric, value) {
  const range = SENSOR_RANGES[metric]
  if (!range) return 'healthy'

  const buffer = (range.max - range.min) * 0.1
  if (value < range.min - buffer || value > range.max + buffer) return 'critical'
  if (value < range.min || value > range.max) return 'warning'
  return 'healthy'
}

/**
 * Derives the overall slot health from all sensor readings.
 * @param {import('../types/index').SensorReading} reading
 * @returns {'critical'|'warning'|'healthy'}
 */
export function getSlotStatus(reading) {
  const metrics = ['humidity', 'ph', 'waterLevel', 'temperature', 'light', 'minerals']
  const statuses = metrics.map((m) => getMetricStatus(m, reading[m]))
  if (statuses.includes('critical')) return 'critical'
  if (statuses.includes('warning'))  return 'warning'
  return 'healthy'
}

/**
 * Simple linear growth forecast — days to harvest estimate.
 * @param {number} currentDay   - Day of growth cycle
 * @param {number} totalDays    - Expected total grow cycle
 * @param {'critical'|'warning'|'healthy'} status
 * @returns {number}            - Estimated remaining days
 */
export function estimateDaysToHarvest(currentDay, totalDays, status) {
  const penalty = status === 'critical' ? 1.3 : status === 'warning' ? 1.1 : 1
  return Math.max(0, Math.round((totalDays - currentDay) * penalty))
}
