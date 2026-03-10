import { GiftCard } from './GiftCard'
import { GiftItem } from '../data/gifts'
interface GiftListProps {
  gifts: GiftItem[]
  onGiftClick?: (gift: GiftItem) => void
}
export function GiftList({ gifts, onGiftClick }: GiftListProps) {
  if (gifts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center">
        <p className="font-cormorant font-normal text-[24px] text-midnight/40 mb-2">
          No gifts found
        </p>
        <p className="text-gilded text-sm">
          Try adjusting your filters or search query.
        </p>
      </div>
    )
  }
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
      style={{
        gridAutoRows: 'minmax(min(360px, calc(100vh - 260px)), 1fr)',
      }}
    >
      {gifts.map((gift) => (
        <GiftCard key={gift.id} gift={gift} onClick={onGiftClick} />
      ))}
    </div>
  )
}
