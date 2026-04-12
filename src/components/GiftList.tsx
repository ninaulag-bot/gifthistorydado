import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { GiftCard } from './GiftCard'
import { GiftItem } from '../data/gifts'

interface GiftListProps {
  gifts: GiftItem[]
}

/** 12-column placement: featured ~58% / ~42%, then 50/50, then mirrored ~42% / ~58% */
function editorialPlacement(index: number, total: number): string {
  if (total === 0) return ''
  const isLastSolo = total % 2 === 1 && index === total - 1
  if (isLastSolo) {
    return 'md:col-span-12'
  }
  const pair = Math.floor(index / 2)
  const pos = index % 2
  const cycle = pair % 3
  if (cycle === 0) {
    return pos === 0
      ? 'md:col-start-1 md:col-span-7'
      : 'md:col-start-8 md:col-span-5'
  }
  if (cycle === 1) {
    return pos === 0
      ? 'md:col-start-1 md:col-span-6'
      : 'md:col-start-7 md:col-span-6'
  }
  return pos === 0
    ? 'md:col-start-1 md:col-span-5'
    : 'md:col-start-6 md:col-span-7'
}

function portraitMinHeightClass(index: number, total: number): string {
  const isLastSolo = total % 2 === 1 && index === total - 1
  if (isLastSolo) {
    return 'min-h-[min(52vh,560px)] md:min-h-[min(48vh,520px)]'
  }
  const pair = Math.floor(index / 2)
  const cycle = pair % 3
  const isFeaturedPair = cycle === 0 || cycle === 2
  if (isFeaturedPair) {
    return 'min-h-[min(58vh,620px)] md:min-h-[min(56vh,640px)]'
  }
  return 'min-h-[min(52vh,520px)] md:min-h-[min(50vh,560px)]'
}

function giftSearchHaystack(g: GiftItem): string {
  const noteBodies =
    g.personalNotes?.map((n) => n.body).join(' ') ?? ''
  return [
    g.name,
    g.person.name,
    g.person.relationship,
    g.occasion,
    g.date,
    g.notes ?? '',
    noteBodies,
    g.direction,
  ]
    .join(' ')
    .toLowerCase()
}

export function GiftList({ gifts }: GiftListProps) {
  const [query, setQuery] = useState('')

  const displayGifts = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return gifts
    return gifts.filter((g) => giftSearchHaystack(g).includes(q))
  }, [gifts, query])

  if (gifts.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center py-16 sm:py-20 text-center">
        <p className="font-cormorant font-normal text-[24px] text-midnight/40 mb-2">
          No gifts found
        </p>
        <p className="text-gilded text-sm">
          Try a different view in the sidebar.
        </p>
      </div>
    )
  }

  const count = displayGifts.length

  return (
    <div className="-mt-3 flex min-h-0 flex-1 flex-col sm:-mt-4 lg:-mt-5">
      <div className="flex min-h-[44px] shrink-0 items-center border-b border-bond-blue/35 px-5 sm:min-h-[48px] sm:px-8">
        <label className="relative flex w-full max-w-[320px] shrink-0 items-center bg-transparent px-0 sm:w-[300px]">
          <span className="sr-only">Search gifts</span>
          <Search
            className="pointer-events-none mr-1.5 h-3 w-3 shrink-0 text-gilded"
            strokeWidth={1.5}
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search gifts..."
            className="min-w-0 flex-1 border-0 bg-transparent py-0.5 pl-0 pr-1 font-sans text-sm font-normal leading-tight normal-case tracking-normal text-midnight placeholder:text-gilded placeholder:text-[10px] placeholder:font-medium placeholder:uppercase placeholder:tracking-[0.14em] focus:outline-none focus:ring-0"
          />
        </label>
      </div>

      {count === 0 ? (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-5 py-16 text-center sm:px-8">
          <p className="font-sans text-sm font-light text-gilded">
            No gifts match your search.
          </p>
        </div>
      ) : (
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-px bg-bond-blue/30 md:grid-cols-12">
          {displayGifts.map((gift, index) => (
            <GiftCard
              key={gift.id}
              gift={gift}
              editorial
              layoutClassName={`${editorialPlacement(index, count)} ${portraitMinHeightClass(index, count)} h-full w-full md:h-full`}
              to={`/gifts/${encodeURIComponent(gift.id)}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
