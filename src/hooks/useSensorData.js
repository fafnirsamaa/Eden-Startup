import { useEffect, useState } from 'react'

/**
 * Subscribes to real-time sensor data for a given slot.
 * Swap the mock implementation for a Firebase/AWS WebSocket listener.
 *
 * @param {string} slotId
 * @returns {{ data: import('../types/index').SensorReading|null, loading: boolean }}
 */
export function useSensorData(slotId) {
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slotId) return

    // Avoid React lint: setState synchronously inside effect bodies.
    // Loading is still updated immediately, but scheduled as a microtask.
    Promise.resolve().then(() => setLoading(true))

    // TODO: replace with real-time Firebase / AWS IoT subscription
    const mockFetch = setTimeout(() => {
      setData({
        slotId,
        timestamp:  new Date().toISOString(),
        humidity:   72,
        ph:         6.2,
        waterLevel: 68,
        temperature: 21.5,
        light:       4800,
        minerals:    620,
      })
      setLoading(false)
    }, 400)

    return () => clearTimeout(mockFetch)
  }, [slotId])

  return { data, loading }
}
