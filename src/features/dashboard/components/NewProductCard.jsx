/**
 * "Nouveauté" full-bleed product announcement card (169:4734 in Figma).
 * Photo background with a dark gradient overlay and text pinned to the bottom.
 */
import { useNavigate } from 'react-router-dom'

/* Figma assets — 7-day expiry. Replace with CDN URLs before production. */
const GARDEN_IMAGE_URL = 'https://www.figma.com/api/mcp/asset/f2d9dc54-86f5-4ff6-8dc6-840476ef80fd'

export function NewProductCard({ imageUrl = GARDEN_IMAGE_URL, productSlug }) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (productSlug) navigate(`/marketplace/${productSlug}`)
  }

  return (
    <div
      className="relative overflow-hidden rounded-lg flex flex-col justify-between p-2 cursor-pointer"
      style={{ height: 214 }}
      onClick={handleClick}
      role={productSlug ? 'button' : undefined}
      tabIndex={productSlug ? 0 : undefined}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      {/* Full-bleed photo */}
      <div className="absolute inset-0 rounded-lg overflow-hidden" aria-hidden="true">
        <img
          src={imageUrl}
          alt="Eden L — nouveau modèle gros volume"
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay — bottom 60% */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.65) 100%)',
          }}
        />
        {/* Frosted-glass blur strip at very bottom */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ height: 74, backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)' }}
        />
      </div>

      {/* Badge — top-left */}
      <span
        className="font-body text-xs font-medium rounded-full px-2 self-start relative z-10"
        style={{
          background: 'var(--color-eden-lime)',
          color: 'var(--color-eden-ink)',
          paddingTop: 4,
          paddingBottom: 4,
        }}
      >
        Nouveauté
      </span>

      {/* Caption — bottom */}
      <p
        className="font-heading text-lg font-medium leading-tight relative z-10"
        style={{ color: 'var(--color-eden-light)' }}
      >
        {'Découvrez notre tout dernier modèle gros volume, '}
        <span
          className="font-heading font-bold"
          style={{ color: 'var(--color-eden-lime)' }}
        >
          Eden L
        </span>
      </p>
    </div>
  )
}
