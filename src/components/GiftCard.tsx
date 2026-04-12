import { Link } from 'react-router-dom'
import { GiftItem } from '../data/gifts'

const copyShadow =
  '[text-shadow:0_1px_2px_rgba(0,0,0,0.5),0_2px_8px_rgba(0,0,0,0.35)]'

interface GiftCardProps {
  gift: GiftItem
  /** Editorial archive cards: full-bleed, gradient, bottom copy; no chrome */
  editorial?: boolean
  layoutClassName?: string
  /** When set, the whole card is a client-side route (own URL). Prefer over onClick for navigation. */
  to?: string
  onClick?: (gift: GiftItem) => void
}

export function GiftCard({
  gift,
  editorial = false,
  layoutClassName = '',
  to,
  onClick,
}: GiftCardProps) {
  const isGiven = gift.direction === 'given'
  const directionLabel = isGiven ? 'GIVEN' : 'RECEIVED'
  const personLine = `${gift.person.name.toUpperCase()} · ${gift.person.relationship.toUpperCase()}`
  const occasionLine = `${gift.occasion} · ${gift.date}`

  const articleBase =
    'group relative isolate h-full min-h-0 w-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-bond-blue focus-visible:ring-offset-2 focus-visible:ring-offset-cream'

  const articleChrome = editorial
    ? 'overflow-hidden bg-black'
    : 'overflow-visible border border-cashmere/40 bg-midnight/5 transition-shadow duration-300 hover:shadow-lg'

  const shellClass = `${articleBase} ${articleChrome} ${layoutClassName}`
  const aria = `${gift.name}, ${gift.occasion}`

  const body = (
    <>
      <div className="absolute inset-0 z-0 min-h-0 overflow-hidden">
        {gift.imageUrl ? (
          <img
            src={gift.imageUrl}
            alt=""
            className={`h-full w-full object-cover ${editorial ? '' : 'transition-transform duration-500 group-hover:scale-[1.02]'}`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-cashmere/85">
            <span className="text-7xl opacity-90 sm:text-8xl" role="img" aria-hidden>
              {gift.emoji}
            </span>
          </div>
        )}
        {editorial ? (
          <div
            className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0.35)_38%,transparent_72%)]"
            aria-hidden
          />
        ) : null}
      </div>

      {!editorial && (
        <div className="pointer-events-none absolute left-3 top-3 z-10 sm:left-4 sm:top-4">
          <span
            className={`rounded-sm bg-white/25 px-2.5 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.12em] text-white antialiased backdrop-blur-[2px] ${copyShadow}`}
          >
            {directionLabel}
          </span>
        </div>
      )}

      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 text-left ${editorial ? 'px-4 pb-6 pt-8 sm:px-6 sm:pb-8' : 'px-3 pb-5 pt-2 sm:px-4 sm:pb-6'}`}
      >
        <div className={editorial ? 'space-y-2' : 'space-y-1.5'}>
          <p
            className={`font-sans font-medium uppercase leading-normal tracking-[0.12em] text-white antialiased ${editorial ? 'text-[11px]' : `text-[10px] tracking-[0.14em] ${copyShadow}`}`}
          >
            {personLine}
          </p>
          <h3
            className={`break-words font-cormorant font-normal not-italic leading-[1.1] tracking-normal text-white antialiased ${editorial ? `text-[28px] sm:text-[30px] lg:text-[32px] ${copyShadow}` : `text-2xl leading-normal sm:text-[28px] sm:leading-normal ${copyShadow}`}`}
          >
            {gift.name}
          </h3>
          <p
            className={`font-sans font-light leading-snug text-white antialiased ${editorial ? 'text-xs sm:text-[12px] text-white/90' : `text-xs leading-normal ${copyShadow}`}`}
          >
            {occasionLine}
          </p>
        </div>
      </div>
    </>
  )

  if (to) {
    return (
      <Link
        to={to}
        aria-label={aria}
        className={`${shellClass} block min-h-0 text-inherit no-underline`}
        onClick={() => onClick?.(gift)}
      >
        {body}
      </Link>
    )
  }

  return (
    <article
      onClick={() => onClick?.(gift)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.(gift)
        }
      }}
      tabIndex={0}
      aria-label={aria}
      className={shellClass}
    >
      {body}
    </article>
  )
}
