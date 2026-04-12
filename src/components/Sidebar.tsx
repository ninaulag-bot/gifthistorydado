import { X } from 'lucide-react'
import { PersonData } from '../data/gifts'

export type SidebarNavigateTo =
  | 'gifts-all'
  | 'gifts-given'
  | 'gifts-received'
  | 'timeline'

type GiftFilter = 'all' | 'given' | 'received'

interface SidebarProps {
  activeView: 'all-gifts' | 'timeline'
  activeFilter: GiftFilter
  activePerson: string | null
  onNavigate: (to: SidebarNavigateTo) => void
  onPersonChange: (person: string | null) => void
  people: PersonData[]
  totalGiftCount: number
  givenGiftCount: number
  receivedGiftCount: number
  isOpen?: boolean
  onClose?: () => void
}

/** Left rule + blue type when selected; light gray tint behind selection. */
const sidebarSelectedTint = 'bg-midnight/[0.06]'
const giftNavRowBase =
  'relative w-full flex items-center justify-between pl-3 pr-4 py-2 text-left font-sans border-l-2 transition-colors duration-200'
const giftNavRowInactive = `${giftNavRowBase} border-l-transparent text-gilded hover:text-midnight/60`
const giftNavRowActive = `${giftNavRowBase} border-l-bond-blue text-bond-blue ${sidebarSelectedTint}`
const sidebarTracking = 'tracking-[0.14em]'
const navLabelClass = `text-xs uppercase ${sidebarTracking}`
const navCountClass = `text-[13px] tabular-nums ${sidebarTracking}`

export function Sidebar({
  activeView,
  activeFilter,
  activePerson,
  onNavigate,
  onPersonChange,
  people,
  totalGiftCount,
  givenGiftCount,
  receivedGiftCount,
  isOpen = false,
  onClose,
}: SidebarProps) {
  const handlePersonClick = (personName: string) => {
    if (activePerson === personName) {
      onPersonChange(null)
    } else {
      onPersonChange(personName)
    }
    onClose?.()
  }

  const isGiftsContext = activeView === 'all-gifts' && !activePerson
  const isAllGiftsActive = isGiftsContext && activeFilter === 'all'
  const isGivenActive = isGiftsContext && activeFilter === 'given'
  const isReceivedActive = isGiftsContext && activeFilter === 'received'
  const isTimelineActive = activeView === 'timeline' && !activePerson

  const sidebarContent = (
    <>
      <div className="lg:hidden flex items-center justify-between px-6 pt-3 pb-1.5 mb-5">
        <span
          className={`font-sans text-midnight text-xs font-normal uppercase ${sidebarTracking}`}
        >
          Menu
        </span>
        <button
          onClick={onClose}
          className="text-gilded hover:text-midnight transition-colors"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" strokeWidth={1.6} />
        </button>
      </div>

      <nav className="mb-6 mt-2 lg:mt-0" aria-label="Gift filters">
        <button
          type="button"
          onClick={() => {
            onNavigate('gifts-all')
            onClose?.()
          }}
          className={isAllGiftsActive ? giftNavRowActive : giftNavRowInactive}
          aria-current={isAllGiftsActive ? 'page' : undefined}
        >
          <span
            className={`${navLabelClass} ${isAllGiftsActive ? 'font-semibold' : 'font-normal'}`}
          >
            All Gifts
          </span>
          <span
            className={`${navCountClass} ${isAllGiftsActive ? 'font-semibold' : 'font-normal'}`}
          >
            {totalGiftCount}
          </span>
        </button>
        <button
          type="button"
          onClick={() => {
            onNavigate('gifts-given')
            onClose?.()
          }}
          className={isGivenActive ? giftNavRowActive : giftNavRowInactive}
          aria-current={isGivenActive ? 'page' : undefined}
        >
          <span
            className={`${navLabelClass} ${isGivenActive ? 'font-semibold' : 'font-normal'}`}
          >
            Given
          </span>
          <span
            className={`${navCountClass} ${isGivenActive ? 'font-semibold' : 'font-normal'}`}
          >
            {givenGiftCount}
          </span>
        </button>
        <button
          type="button"
          onClick={() => {
            onNavigate('gifts-received')
            onClose?.()
          }}
          className={isReceivedActive ? giftNavRowActive : giftNavRowInactive}
          aria-current={isReceivedActive ? 'page' : undefined}
        >
          <span
            className={`${navLabelClass} ${isReceivedActive ? 'font-semibold' : 'font-normal'}`}
          >
            Received
          </span>
          <span
            className={`${navCountClass} ${isReceivedActive ? 'font-semibold' : 'font-normal'}`}
          >
            {receivedGiftCount}
          </span>
        </button>
      </nav>

      <div className="border-t border-bond-blue/35 my-4" />

      <nav className="mb-3" aria-label="Timeline">
        <button
          type="button"
          onClick={() => {
            onNavigate('timeline')
            onClose?.()
          }}
          className={isTimelineActive ? giftNavRowActive : giftNavRowInactive}
          aria-current={isTimelineActive ? 'page' : undefined}
        >
          <span
            className={`${navLabelClass} ${isTimelineActive ? 'font-semibold' : 'font-normal'}`}
          >
            Timeline
          </span>
        </button>
      </nav>

      <div className="border-t border-bond-blue/35 my-4" />

      <p
        id="sidebar-people-heading"
        className={`font-sans text-gilded font-normal ${navLabelClass} mb-3`}
      >
        People
      </p>

      <nav aria-labelledby="sidebar-people-heading">
        {people.map((person) => {
          const isActive = activePerson === person.name
          return (
            <button
              key={person.name}
              type="button"
              onClick={() => handlePersonClick(person.name)}
              className={`w-full flex items-center gap-3 pl-3 pr-4 py-2 text-left font-sans border-l-2 transition-colors duration-300 ${
                isActive
                  ? `border-l-bond-blue text-bond-blue ${sidebarSelectedTint}`
                  : 'border-l-transparent text-gilded hover:text-midnight/60'
              }`}
            >
              <span
                className={`flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full font-sans opacity-75 ring-1 ring-midnight/10 ${person.avatarColor}`}
              >
                <span
                  className={`text-[8px] font-semibold uppercase text-white/90 ${sidebarTracking}`}
                >
                  {person.initials}
                </span>
              </span>
              <span
                className={`flex-1 text-xs uppercase ${sidebarTracking} ${isActive ? 'font-semibold' : 'font-normal'}`}
              >
                {person.name}
              </span>
              <span
                className={`text-[11px] tabular-nums ${sidebarTracking} ${isActive ? 'font-semibold' : 'font-normal'}`}
              >
                {person.giftCount}
              </span>
            </button>
          )
        })}
      </nav>
    </>
  )

  return (
    <>
      <aside className="hidden lg:block w-[260px] flex-shrink-0 bg-cream border-r border-bond-blue/35 overflow-y-auto px-6 pt-5 pb-8 font-sans">
        {sidebarContent}
      </aside>

      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-midnight/30" onClick={onClose} />
          <aside className="absolute left-0 top-0 bottom-0 w-[280px] bg-cream border-r border-bond-blue/35 overflow-y-auto px-6 pt-4 pb-8 shadow-xl font-sans">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}
