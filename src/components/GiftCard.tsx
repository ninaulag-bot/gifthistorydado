import {
  Calendar,
  Heart,
} from 'lucide-react'
import { GiftItem } from '../data/gifts'
interface GiftCardProps {
  gift: GiftItem
  onClick?: (gift: GiftItem) => void
}
export function GiftCard({ gift, onClick }: GiftCardProps) {
  const isGiven = gift.direction === 'given'
  const directionLabel = isGiven ? 'Given' : 'Received'
  const areaBg = isGiven ? 'bg-bond-blue/15' : 'bg-amber-warm/15'
  const stripBg = isGiven ? 'bg-bond-blue' : 'bg-[#C4B5A0]/85'
  return (
    <article
      onClick={() => onClick?.(gift)}
      className="flex flex-col h-full min-h-0 bg-[#faf9f4] border border-bond-blue transition-all duration-300 hover:border-bond-blue/60 hover:shadow-[0_2px_12px_rgba(140,169,196,0.15)] hover:-translate-y-px cursor-pointer relative"
    >
      {/* Image area - 65-70% of card, strip at top, image below */}
      <div className="flex flex-col flex-[0_0_68%] min-h-[140px] overflow-hidden">
        {/* Direction strip */}
        <div className={`flex-shrink-0 py-1.5 px-5 ${stripBg} flex items-center justify-center`}>
          <span className="text-white text-[10px] font-medium uppercase" style={{ letterSpacing: '0.14em' }}>
            {directionLabel}
          </span>
        </div>
        {/* Image or Emoji - fills remaining space only */}
        <div className={`flex-1 min-h-0 relative overflow-hidden ${!gift.imageUrl ? areaBg : ''}`}>
          {gift.imageUrl ? (
            <img
              src={gift.imageUrl}
              alt={gift.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className={`absolute inset-0 flex items-center justify-center ${areaBg}`}>
              <span className="text-5xl sm:text-6xl" role="img" aria-label={gift.name}>
                {gift.emoji}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content area - white/cream at bottom */}
      <div className="flex-1 min-h-0 px-5 py-5 sm:px-6 sm:py-6 flex flex-col justify-center bg-[#faf9f4]">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-cormorant font-normal text-[20px] text-midnight leading-snug line-clamp-2">
            {gift.name}
          </h3>
          {gift.source === 'dado' ? (
            <span className="flex-shrink-0 text-bond-blue bg-bond-blue/10 px-2 py-0.5 text-[9px] font-medium uppercase whitespace-nowrap" style={{ letterSpacing: '0.1em' }}>
              ✦ DADO
            </span>
          ) : (
            <span className="flex-shrink-0 text-bond-blue bg-bond-blue/10 px-2 py-0.5 text-[9px] font-medium uppercase whitespace-nowrap" style={{ letterSpacing: '0.1em' }}>
              ✎ Manual
            </span>
          )}
        </div>
        <p className="font-sans text-sm text-midnight font-medium mb-3">
          {gift.person.name}
          <span className="text-gilded font-normal"> · {gift.person.relationship}</span>
        </p>
        <div className="flex flex-wrap items-center gap-x-3 text-xs text-gilded font-sans">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-bond-blue" strokeWidth={1.6} />
            {gift.date}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-bond-blue" strokeWidth={1.6} />
            {gift.occasion}
          </span>
        </div>
      </div>
    </article>
  )
}
