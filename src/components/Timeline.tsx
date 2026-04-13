import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { GiftItem } from '../data/gifts'
import { giftDirPillClass } from '../lib/giftDirectionTags'

const copyShadow =
  '[text-shadow:0_1px_2px_rgba(0,0,0,0.5),0_2px_8px_rgba(0,0,0,0.35)]'

/** Uniform landscape cards: wide frame, `object-cover` fills the whole click target */
const timelineCardSize =
  'h-[220px] w-[320px] sm:h-[236px] sm:w-[360px]'

interface TimelineProps {
  gifts: GiftItem[]
}

interface GroupedGifts {
  year: string
  items: GiftItem[]
}

function parseDate(dateStr: string): Date {
  return new Date(dateStr)
}

function groupByYear(gifts: GiftItem[]): GroupedGifts[] {
  const sorted = [...gifts].sort(
    (a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime(),
  )
  const groups: Record<string, GiftItem[]> = {}
  sorted.forEach((gift) => {
    const year = parseDate(gift.date).getFullYear().toString()
    if (!groups[year]) groups[year] = []
    groups[year].push(gift)
  })
  return Object.entries(groups)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, items]) => ({
      year,
      items,
    }))
}

function formatDateMonthDay(dateStr: string): string {
  const d = parseDate(dateStr)
  if (!Number.isNaN(d.getTime())) {
    return d.toLocaleString('en-US', { month: 'long', day: 'numeric' })
  }
  return dateStr.trim()
}

export function Timeline({ gifts }: TimelineProps) {
  const grouped = useMemo(() => groupByYear(gifts), [gifts])

  return (
    <div>
      <h2 className="mb-6 font-cormorant text-[24px] font-light text-midnight sm:mb-7">
        Timeline
      </h2>

      {grouped.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center sm:py-16">
          <p className="mb-2 font-cormorant text-[24px] font-normal text-midnight/40">
            No gifts found
          </p>
          <p className="text-sm text-gilded">
            Try a different view in the sidebar.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-20 sm:gap-24">
          {grouped.map((group) => (
            <section key={group.year} className="min-w-0">
              <div className="-mt-1 mb-6 flex min-w-0 items-end gap-4 sm:mb-7 sm:gap-5">
                <h3 className="shrink-0 -mt-1 font-cormorant text-[56px] font-light leading-[0.9] tracking-[0.02em] text-bond-blue/90 antialiased sm:-mt-2 sm:text-[60px] sm:tracking-[0.015em]">
                  {group.year}
                </h3>
                <div
                  className="mb-2.5 h-px min-h-px flex-1 bg-bond-blue/25 sm:mb-3"
                  aria-hidden
                />
              </div>

              <div className="min-w-0">
                <div
                  className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden px-1 pb-3 pt-0.5 sm:gap-5 sm:pb-4"
                  style={{ WebkitOverflowScrolling: 'touch' }}
                >
                  {group.items.map((gift) => {
                    const personLine = `${gift.person.name.toUpperCase()} · ${gift.person.relationship.toUpperCase()}`
                    const occasionLine = `${gift.occasion} · ${formatDateMonthDay(gift.date)}`
                    const isGiven = gift.direction === 'given'
                    const dirLabel = isGiven ? 'GIVEN' : 'RECEIVED'

                    return (
                      <Link
                        key={gift.id}
                        to={`/gifts/${encodeURIComponent(gift.id)}`}
                        aria-label={`${gift.name}, ${gift.occasion}`}
                        className={`group relative isolate shrink-0 snap-start block overflow-hidden border-0 bg-midnight p-0 text-left text-inherit no-underline shadow-none outline-none ring-0 transition-[box-shadow] focus-visible:ring-2 focus-visible:ring-bond-blue focus-visible:ring-offset-2 focus-visible:ring-offset-white ${timelineCardSize}`}
                      >
                        <div className="pointer-events-none absolute left-3 top-3 z-20 sm:left-4 sm:top-4">
                          <span className={giftDirPillClass(isGiven)}>
                            {dirLabel}
                          </span>
                        </div>
                        {gift.imageUrl ? (
                          <img
                            src={gift.imageUrl}
                            alt=""
                            className="absolute inset-0 z-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                          />
                        ) : (
                          <div className="absolute inset-0 z-0 flex items-center justify-center bg-cashmere/85">
                            <span
                              className="text-5xl opacity-90 sm:text-6xl"
                              role="img"
                              aria-hidden
                            >
                              {gift.emoji}
                            </span>
                          </div>
                        )}
                        <div
                          className="pointer-events-none absolute inset-0 z-[1] bg-bond-blue/40"
                          aria-hidden
                        />
                        <div
                          className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(to_top,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.45)_42%,transparent_68%)]"
                          aria-hidden
                        />

                        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-4 pb-4 pt-12 sm:px-5 sm:pb-4 sm:pt-14">
                          <div className="max-w-[85%] space-y-1 sm:space-y-1.5">
                            <p
                              className={`font-sans text-[9px] font-medium uppercase leading-normal tracking-[0.12em] text-white antialiased sm:text-[10px] ${copyShadow}`}
                            >
                              {personLine}
                            </p>
                            <h4
                              className={`break-words font-cormorant text-[20px] font-normal not-italic leading-[1.06] tracking-normal text-white antialiased sm:text-[22px] ${copyShadow}`}
                            >
                              {gift.name}
                            </h4>
                            <p
                              className={`font-sans text-[10px] font-light leading-snug text-white/92 antialiased sm:text-[11px] ${copyShadow}`}
                            >
                              {occasionLine}
                            </p>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
