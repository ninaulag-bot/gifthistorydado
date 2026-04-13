import { Plus } from 'lucide-react'
import { PersonData, GiftItem } from '../data/gifts'
import {
  giftDirCountNumberClass,
  giftDirCountRowClass,
} from '../lib/giftDirectionTags'
interface RelationshipsProps {
  people: PersonData[]
  gifts: GiftItem[]
  onPersonClick?: (personName: string) => void
  onAddConnection?: () => void
  onAddGiftForPerson?: (personName: string) => void
}
export function Relationships({
  people,
  gifts,
  onPersonClick,
  onAddConnection,
  onAddGiftForPerson,
}: RelationshipsProps) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
        <h2 className="font-cormorant font-normal text-[24px] text-midnight">
          Relationships
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={onAddConnection}
            className="flex items-center gap-2 bg-bond-blue text-white px-4 py-2 font-sans text-[13px] font-light uppercase transition-all duration-300 hover:bg-bond-blue/90"
            style={{ letterSpacing: '1px' }}
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            Add a Relationship
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {people.map((person) => {
          const personGifts = gifts.filter((g) => g.person.name === person.name)
          const givenCount = personGifts.filter(
            (g) => g.direction === 'given',
          ).length
          const receivedCount = personGifts.filter(
            (g) => g.direction === 'received',
          ).length
          return (
            <article
              key={person.name}
              onClick={() => onPersonClick?.(person.name)}
              className="bg-white border border-cashmere rounded-none p-5 sm:p-6 transition-all duration-300 hover:border-bond-blue/40 hover:shadow-[0_2px_12px_rgba(140,169,196,0.15)] cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${person.avatarColor}`}
                >
                  <span className="text-white text-sm font-semibold">
                    {person.initials}
                  </span>
                </span>
                <div className="flex-1">
                  <h3 className="font-cormorant font-normal text-xl text-midnight leading-tight">
                    {person.name}
                  </h3>
                  <p className="text-gilded text-sm">{person.relationship}</p>
                  {person.birthday && (
                    <p className="text-gilded/70 text-xs mt-0.5">
                      🎂 {person.birthday}, 1985
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <div className={giftDirCountRowClass('given')}>
                  <span style={{ letterSpacing: '0.12em' }}>Given</span>
                  <span className={giftDirCountNumberClass}>{givenCount}</span>
                </div>
                <div className={giftDirCountRowClass('received')}>
                  <span style={{ letterSpacing: '0.12em' }}>Received</span>
                  <span className={giftDirCountNumberClass}>
                    {receivedCount}
                  </span>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
