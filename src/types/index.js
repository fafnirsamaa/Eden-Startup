/**
 * Eden — Shared type definitions
 *
 * @typedef {Object} Slot
 * @property {string}  id
 * @property {string}  name
 * @property {string}  plant         - Plant name
 * @property {string}  imageUrl      - Unsplash URL
 * @property {'healthy'|'warning'|'critical'} status
 * @property {number}  humidity      - 0–100 %
 * @property {number}  ph            - 0–14
 * @property {number}  waterLevel    - 0–100 %
 * @property {number}  temperature   - °C
 * @property {number}  light         - lux
 * @property {number}  minerals      - mg/L
 * @property {string}  lastUpdated   - ISO timestamp
 * @property {number}  daysToHarvest
 *
 * @typedef {Object} Notification
 * @property {string}  id
 * @property {string}  slotId
 * @property {'info'|'warning'|'success'} type
 * @property {string}  message
 * @property {string}  createdAt     - ISO timestamp
 * @property {boolean} read
 *
 * @typedef {Object} Product
 * @property {string}  id
 * @property {string}  name
 * @property {'seed'|'substrate'|'nutrient'} category
 * @property {number}  price         - EUR
 * @property {string}  imageUrl      - Unsplash URL
 * @property {string}  description
 * @property {number}  stock
 *
 * @typedef {Object} SensorReading
 * @property {string}  slotId
 * @property {string}  timestamp     - ISO timestamp
 * @property {number}  humidity
 * @property {number}  ph
 * @property {number}  waterLevel
 * @property {number}  temperature
 * @property {number}  light
 * @property {number}  minerals
 */
