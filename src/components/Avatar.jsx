import { useState } from 'react'
import { UserRound } from 'lucide-react'
import { PROFILE_IMG } from '@/features/profile/profileConstants'

/**
 * Round profile image with fallback when URL fails.
 * @param {{ src?: string, size?: number, className?: string }} [props]
 */
export function Avatar({ src = PROFILE_IMG, size = 42, className = '' }) {
  const [broken, setBroken] = useState(false)
  if (broken) {
    return (
      <div
        className={`flex items-center justify-center rounded-full overflow-hidden shrink-0 ${className}`}
        style={{ width: size, height: size, background: 'var(--color-eden-elevated)' }}
      >
        <UserRound size={Math.round(size * 0.52)} color="var(--color-eden-light)" strokeWidth={1.5} />
      </div>
    )
  }
  return (
    <img
      src={src}
      alt=""
      onError={() => setBroken(true)}
      className={`rounded-full object-cover shrink-0 ${className}`}
      style={{ width: size, height: size }}
    />
  )
}
