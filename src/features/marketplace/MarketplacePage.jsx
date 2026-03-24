import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, ShoppingCart, Leaf, Droplets, Sprout, Wrench } from 'lucide-react'
import { gsap } from '@/lib/gsap'
import { BottomNav } from '@/components/layout/BottomNav'
import { Avatar } from '@/components/Avatar'
import laitueImg from '@/assets/images/laitue.webp'
import tomatoImg from '@/assets/images/tomato.webp'
import basilicImg from '@/assets/images/basilic.webp'
import edenLogo from '@/assets/images/eden_logo.svg'

/* ── Static data ───────────────────────────────────────────── */
const CATEGORIES = [
  { id: 'all',        label: 'Tout',    Icon: null },
  { id: 'seeds',      label: 'Graines', Icon: Sprout },
  { id: 'soil',       label: 'Substrat',Icon: Leaf },
  { id: 'fertilizer', label: 'Engrais', Icon: Droplets },
  { id: 'tools',      label: 'Outils',  Icon: Wrench },
]

const CATEGORY_ICON = { seeds: Sprout, soil: Leaf, fertilizer: Droplets, tools: Wrench }

const CATEGORY_TINT = {
  seeds:      'rgba(46, 89, 62, 0.9)',
  soil:       'rgba(74, 53, 26, 0.9)',
  fertilizer: 'rgba(28, 68, 52, 0.9)',
  tools:      'rgba(36, 45, 72, 0.9)',
}

const MOCK_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Tomates Cerise',
    producer: 'Maison Vilmorin',
    location: 'Île-de-France',
    price: 4.90,
    category: 'seeds',
    badge: 'Bestseller',
    unit: 'sachet 0,5 g',
    bio: true,
    image: tomatoImg,
  },
  {
    id: 'prod-2',
    name: 'Laitue Batavia',
    producer: 'Graines Baumaux',
    location: 'Lorraine',
    price: 3.50,
    category: 'seeds',
    badge: null,
    unit: 'sachet 1 g',
    bio: true,
    image: laitueImg,
  },
  {
    id: 'prod-3',
    name: 'Basilic Génois',
    producer: 'Kokopelli',
    location: 'Occitanie',
    price: 3.90,
    category: 'seeds',
    badge: 'Bio',
    unit: 'sachet 0,5 g',
    bio: true,
    image: basilicImg,
  },
  {
    id: 'prod-4',
    name: 'Terreau Universel Bio',
    producer: 'Biobest France',
    location: 'Bretagne',
    price: 12.90,
    category: 'soil',
    badge: 'Bio',
    unit: 'sac 20 L',
    bio: true,
    image: null,
  },
  {
    id: 'prod-5',
    name: 'Compost Premium',
    producer: 'Jardins Actifs',
    location: 'Normandie',
    price: 9.90,
    category: 'soil',
    badge: null,
    unit: 'sac 10 L',
    bio: false,
    image: null,
  },
  {
    id: 'prod-6',
    name: 'Engrais Organique Liquide',
    producer: 'Biolan France',
    location: 'Pays de la Loire',
    price: 14.50,
    category: 'fertilizer',
    badge: 'Nouveau',
    unit: 'flacon 500 ml',
    bio: true,
    image: null,
  },
  {
    id: 'prod-7',
    name: 'Activateur de Compost',
    producer: 'Algoflash Naturasol',
    location: 'Bretagne',
    price: 8.90,
    category: 'fertilizer',
    badge: null,
    unit: 'boîte 700 g',
    bio: false,
    image: null,
  },
  {
    id: 'prod-8',
    name: 'Mini Sécateur de Précision',
    producer: 'Niwaki',
    location: 'Rhône-Alpes',
    price: 24.00,
    category: 'tools',
    badge: 'Nouveau',
    unit: 'pièce',
    bio: false,
    image: null,
  },
]

/* ── Sub-components ────────────────────────────────────────── */

function ProductCard({ product, onAdd }) {
  const [added, setAdded] = useState(false)
  const CatIcon = CATEGORY_ICON[product.category] || Leaf

  function handleAdd() {
    setAdded(true)
    onAdd?.(product)
    setTimeout(() => setAdded(false), 1800)
  }

  const badgeIsAlert = product.badge === 'Nouveau'

  return (
    <div
      style={{
        background: 'var(--color-eden-elevated)',
        borderRadius: 24,
        padding: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 16,
          overflow: 'hidden',
          flexShrink: 0,
          background: product.image ? 'rgba(32,59,50,0.7)' : CATEGORY_TINT[product.category],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center bottom',
            }}
          />
        ) : (
          <CatIcon size={28} color="rgba(252,255,242,0.28)" strokeWidth={1.5} />
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Badges */}
        {(product.badge || product.bio) && (
          <div style={{ display: 'flex', gap: 5, marginBottom: 5, flexWrap: 'wrap' }}>
            {product.badge && (
              <span
                className="font-body"
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  borderRadius: 9999,
                  padding: '2px 8px',
                  background: badgeIsAlert
                    ? 'var(--color-eden-orange)'
                    : 'var(--color-eden-lime)',
                  color: badgeIsAlert
                    ? 'var(--color-eden-light)'
                    : 'var(--color-eden-ink)',
                }}
              >
                {product.badge}
              </span>
            )}
            {product.bio && !product.badge && (
              <span
                className="font-body"
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  borderRadius: 9999,
                  padding: '2px 8px',
                  background: 'rgba(219,255,89,0.15)',
                  color: 'var(--color-eden-lime)',
                }}
              >
                Bio
              </span>
            )}
          </div>
        )}

        <p
          className="font-heading"
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--color-eden-light)',
            margin: 0,
            lineHeight: 1.3,
          }}
        >
          {product.name}
        </p>
        <p
          className="font-body"
          style={{ fontSize: 11, color: 'rgba(252,255,242,0.42)', margin: '3px 0 0' }}
        >
          {product.producer}
          <span style={{ color: 'rgba(252,255,242,0.25)' }}> · </span>
          {product.location}
        </p>
        <p
          className="font-body"
          style={{ fontSize: 11, color: 'rgba(252,255,242,0.26)', margin: '1px 0 0' }}
        >
          {product.unit}
        </p>
      </div>

      {/* Price + add button */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 8,
          flexShrink: 0,
        }}
      >
        <span
          className="font-body"
          style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-eden-light)' }}
        >
          {product.price.toFixed(2).replace('.', ',')} €
        </span>
        <button
          onClick={handleAdd}
          aria-label={`Ajouter ${product.name} au panier`}
          style={{
            width: 36,
            height: 36,
            borderRadius: 9999,
            background: added
              ? 'var(--color-eden-lime)'
              : 'rgba(219,255,89,0.12)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s ease',
            flexShrink: 0,
          }}
        >
          <Plus
            size={18}
            color={added ? 'var(--color-eden-ink)' : 'var(--color-eden-lime)'}
            strokeWidth={2}
          />
        </button>
      </div>
    </div>
  )
}

/* ── Page ──────────────────────────────────────────────────── */

export function MarketplacePage() {
  const pageRef = useRef(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.will-reveal',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.72, stagger: 0.1, ease: 'power3.out', delay: 0.08 }
      )
    }, pageRef)
    return () => ctx.revert()
  }, [])

  const filtered = MOCK_PRODUCTS
    .filter(p => activeCategory === 'all' || p.category === activeCategory)
    .filter(p =>
      !query ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.producer.toLowerCase().includes(query.toLowerCase())
    )

  return (
    <div ref={pageRef} className="min-h-screen" style={{ background: 'var(--color-eden-dark)' }}>
      <div className="mx-auto" style={{ maxWidth: 393 }}>

        {/* Header */}
        <header
          className="will-reveal flex items-center justify-between"
          style={{ padding: '16px 20px 8px' }}
        >
          <div style={{ width: 33, height: 42, display: 'flex', alignItems: 'center' }}>
            <img
              src={edenLogo}
              alt="Eden"
              className="block h-full w-full object-contain"
              style={{ objectPosition: 'left center' }}
            />
          </div>
          <div className="flex items-center" style={{ gap: 8 }}>
            <Link to="/profile" aria-label="Mon profil" className="rounded-full overflow-hidden shrink-0">
              <Avatar />
            </Link>
            <button
              aria-label={`Panier — ${cartCount} article${cartCount !== 1 ? 's' : ''}`}
              className="flex items-center justify-center rounded-full relative"
              style={{
                width: 42,
                height: 42,
                background: 'var(--color-eden-lime)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <ShoppingCart size={20} color="#1D261B" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span
                  className="font-body"
                  style={{
                    position: 'absolute',
                    top: -3,
                    right: -3,
                    width: 18,
                    height: 18,
                    borderRadius: 9999,
                    background: 'var(--color-eden-orange)',
                    color: 'var(--color-eden-light)',
                    fontSize: 10,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1,
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Title */}
        <section className="will-reveal" style={{ padding: '24px 20px 4px' }}>
          <h1
            className="font-heading font-medium"
            style={{ fontSize: 48, lineHeight: 1.1, color: 'var(--color-eden-light)' }}
          >
            Boutique
          </h1>
          <p
            className="font-body"
            style={{ fontSize: 14, color: 'rgba(252,255,242,0.45)', margin: '6px 0 0' }}
          >
            Producteurs locaux partenaires
          </p>
        </section>

        <main style={{ padding: '16px 20px 136px' }}>

          {/* Search */}
          <div
            className="will-reveal"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: 'var(--color-eden-elevated)',
              borderRadius: 16,
              padding: '12px 16px',
              marginBottom: 16,
            }}
          >
            <Search size={18} color="rgba(252,255,242,0.32)" strokeWidth={1.5} />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Rechercher un produit ou producteur…"
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                color: 'var(--color-eden-light)',
                fontSize: 14,
                fontFamily: 'var(--font-body)',
                flex: 1,
                minWidth: 0,
              }}
            />
          </div>

          {/* Category filters */}
          <div
            className="will-reveal"
            style={{
              display: 'flex',
              gap: 8,
              overflowX: 'auto',
              paddingBottom: 4,
              scrollbarWidth: 'none',
              marginBottom: 20,
            }}
          >
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 16px',
                    borderRadius: 9999,
                    border: 'none',
                    cursor: 'pointer',
                    background: isActive
                      ? 'var(--color-eden-lime)'
                      : 'var(--color-eden-elevated)',
                    color: isActive
                      ? 'var(--color-eden-ink)'
                      : 'rgba(252,255,242,0.65)',
                    fontSize: 13,
                    fontFamily: 'var(--font-body)',
                    fontWeight: isActive ? 600 : 400,
                    transition: 'background 0.18s ease, color 0.18s ease',
                  }}
                >
                  {cat.Icon && (
                    <cat.Icon
                      size={14}
                      strokeWidth={1.5}
                      color={isActive ? 'var(--color-eden-ink)' : 'rgba(252,255,242,0.5)'}
                    />
                  )}
                  {cat.label}
                </button>
              )
            })}
          </div>

          {/* Product list */}
          {filtered.length > 0 ? (
            <div className="will-reveal flex flex-col" style={{ gap: 10 }}>
              {filtered.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAdd={() => setCartCount(c => c + 1)}
                />
              ))}
            </div>
          ) : (
            <div
              className="will-reveal"
              style={{
                textAlign: 'center',
                padding: '48px 0',
                color: 'rgba(252,255,242,0.3)',
              }}
            >
              <Search size={36} color="rgba(252,255,242,0.15)" strokeWidth={1} style={{ margin: '0 auto 12px' }} />
              <p className="font-body" style={{ fontSize: 14, margin: 0 }}>
                Aucun produit trouvé
              </p>
            </div>
          )}
        </main>

        <BottomNav />
      </div>
    </div>
  )
}
