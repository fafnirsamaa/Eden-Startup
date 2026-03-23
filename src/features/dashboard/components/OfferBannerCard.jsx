import bgNoise from '../../../assets/images/bg_noise.png'

/**
 * Promotional offer banner card (169:4720 in Figma).
 */

export function OfferBannerCard({ discountPct = 20 }) {
  return (
    <div
      className="relative overflow-hidden rounded-lg flex flex-col justify-between p-2"
      style={{
        minHeight: 164,
        height: 117,
        backgroundColor: 'var(--color-eden-elevated)',
        backgroundImage: `url(${bgNoise})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Badge */}
      <span
        className="font-body text-xs font-medium rounded-full px-2 self-start relative z-10"
        style={{
          background: 'var(--color-eden-lime)',
          color: 'var(--color-eden-ink)',
          paddingTop: 4,
          paddingBottom: 4,
        }}
      >
        Offre
      </span>

      {/* Offer text */}
      <p
        className="font-heading text-lg font-medium leading-tight relative z-10 text-left"
        style={{ color: 'var(--color-eden-light)' }}
      >
        {'Obtenez '}
        <span
          className="font-heading font-bold"
          style={{ color: 'var(--color-eden-lime)' }}
        >
          {discountPct}%
        </span>
        {' de réduction sur votre prochaine commande de graines'}
      </p>
    </div>
  )
}
