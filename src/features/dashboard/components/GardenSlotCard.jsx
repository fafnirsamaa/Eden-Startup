import { ArrowUpRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function GardenSlotCard({ id, name = 'Eden L', status = 'En ligne', imageUrl }) {
  const navigate = useNavigate()

  return (
    <div
      className="pressable-card relative overflow-hidden rounded-lg flex flex-col gap-2 p-2 cursor-pointer"
      style={{ background: 'var(--color-eden-elevated)', height: 230 }}
      onClick={() => id && navigate(`/slot/${id}`)}
      role={id ? 'button' : undefined}
      tabIndex={id ? 0 : undefined}
      aria-label={id ? `Ouvrir ${name}` : undefined}
      onKeyDown={(e) => {
        if (!id) return
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          navigate(`/slot/${id}`)
        }
      }}
    >
      {/* Header row */}
      <div className="flex items-center gap-1">
        <span
          className="font-body text-xs font-medium rounded-full px-2 whitespace-nowrap"
          style={{
            background: 'var(--color-eden-lime)',
            color: 'var(--color-eden-ink)',
            paddingTop: 4,
            paddingBottom: 4,
            width: 76,
          }}
        >
          {status}
        </span>
        <span
          className="font-heading text-lg font-bold leading-tight"
          style={{ color: 'var(--color-eden-light)' }}
        >
          {name}
        </span>
      </div>

      {/* Plant image — centred, fills remaining space */}
      <div className="flex flex-1 items-end justify-center">
        <div
          className="overflow-hidden rounded-xl"
          style={{ width: 285, height: 127 }}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{ background: 'var(--color-eden-dark)' }}
            />
          )}
        </div>
      </div>

      {/* Arrow CTA — absolute top-right */}
      <button
        type="button"
        aria-label={`Voir les détails de ${name}`}
        className="pressable-icon absolute flex items-center justify-center rounded-full transition-opacity duration-150 hover:opacity-80"
        style={{
          top: 8,
          right: 8,
          width: 42,
          height: 42,
          background: 'var(--color-eden-lime)',
        }}
        onClick={(e) => {
          e.stopPropagation()
          if (id) navigate(`/slot/${id}`)
        }}
      >
        <ArrowUpRight size={18} color="#1D261B" strokeWidth={2} />
      </button>
    </div>
  )
}
