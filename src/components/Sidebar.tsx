import type { ReactNode } from 'react'
import {
  Gift,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  ChevronRight,
  HeartHandshake,
  X,
} from 'lucide-react'
import { PersonData } from '../data/gifts'
type ViewType =
  | 'all-gifts'
  | 'received'
  | 'given'
  | 'timeline'
  | 'relationships'
interface SidebarProps {
  activeView: ViewType
  onViewChange: (view: ViewType) => void
  activePerson: string | null
  onPersonChange: (person: string | null) => void
  people: PersonData[]
  isOpen?: boolean
  onClose?: () => void
}
interface NavItem {
  id: ViewType
  label: string
  icon: ReactNode
  count?: number
}
export function Sidebar({
  activeView,
  onViewChange,
  activePerson,
  onPersonChange,
  people,
  isOpen = false,
  onClose,
}: SidebarProps) {
  const navItems: NavItem[] = [
    {
      id: 'all-gifts',
      label: 'ALL GIFTS',
      icon: <Gift className="w-5 h-5" strokeWidth={1.4} />,
      count: 12,
    },
    {
      id: 'received',
      label: 'RECEIVED',
      icon: <ArrowDownLeft className="w-5 h-5" strokeWidth={1.4} />,
      count: 7,
    },
    {
      id: 'given',
      label: 'GIVEN',
      icon: <ArrowUpRight className="w-5 h-5" strokeWidth={1.4} />,
      count: 5,
    },
    {
      id: 'timeline',
      label: 'TIMELINE',
      icon: <Clock className="w-5 h-5" strokeWidth={1.4} />,
    },
    {
      id: 'relationships',
      label: 'RELATIONSHIPS',
      icon: <HeartHandshake className="w-5 h-5" strokeWidth={1.4} />,
    },
  ]
  const handleViewClick = (view: ViewType) => {
    onViewChange(view)
    onPersonChange(null)
    onClose?.()
  }
  const handlePersonClick = (personName: string) => {
    if (activePerson === personName) {
      onPersonChange(null)
    } else {
      onPersonChange(personName)
    }
    onClose?.()
  }
  const sidebarContent = (
    <>
      {/* Mobile close button */}
      <div className="lg:hidden flex items-center justify-between px-6 pt-4 pb-2">
        <span className="font-playfair text-midnight text-lg font-bold italic">
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

      {/* Views Section */}
      <p
        className="font-sans text-[10px] font-medium uppercase text-gilded px-6 mb-4 mt-2 lg:mt-0"
        style={{ letterSpacing: '2px' }}
      >
        Views
      </p>

      <nav className="mb-2" aria-label="Main navigation">
        {navItems.map((item) => {
          const isActive = activeView === item.id && !activePerson
          return (
            <button
              key={item.id}
              onClick={() => handleViewClick(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-3 text-left transition-colors duration-300 ${isActive ? 'text-bond-blue' : 'text-gilded hover:text-midnight/60'}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className={isActive ? 'text-bond-blue' : 'text-gilded'}>
                {item.icon}
              </span>
              <span
                className="flex-1 font-sans text-xs uppercase font-bold"
                style={{ letterSpacing: '2px' }}
              >
                {item.label}
              </span>
              {item.count !== undefined && (
                <span className={`text-[11px] font-medium tabular-nums ${isActive ? 'text-bond-blue' : 'text-gilded/70'}`}>
                  {item.count}
                </span>
              )}
              <ChevronRight
                className={`w-4 h-4 ml-1 flex-shrink-0 ${isActive ? 'text-bond-blue/60' : 'invisible'}`}
                strokeWidth={1.6}
              />
            </button>
          )
        })}
      </nav>

      <div className="border-t border-cashmere my-5 mx-6" />

      <p
        className="text-gilded text-[10px] font-medium uppercase px-6 mb-4"
        style={{ letterSpacing: '0.14em' }}
      >
        People
      </p>

      <div>
        {people.map((person) => {
          const isActive = activePerson === person.name
          return (
            <button
              key={person.name}
              onClick={() => handlePersonClick(person.name)}
              className={`w-full flex items-center gap-4 px-6 py-3 text-left transition-colors duration-300 ${isActive ? 'text-bond-blue' : 'text-gilded hover:text-midnight/60'}`}
            >
              <span
                className={`w-[22px] h-[22px] rounded-full flex items-center justify-center flex-shrink-0 ${person.avatarColor}`}
              >
                <span className="text-white text-[9px] font-semibold">
                  {person.initials}
                </span>
              </span>
              <span
                className="flex-1 text-xs uppercase font-bold"
                style={{ letterSpacing: '0.1em' }}
              >
                {person.name}
              </span>
              <span className={`text-[11px] font-medium tabular-nums ${isActive ? 'text-bond-blue' : 'text-gilded/70'}`}>
                {person.giftCount}
              </span>
              <ChevronRight
                className={`w-4 h-4 ml-1 flex-shrink-0 ${isActive ? 'text-bond-blue/60' : 'invisible'}`}
                strokeWidth={1.6}
              />
            </button>
          )
        })}
      </div>
    </>
  )
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-[260px] flex-shrink-0 bg-cream border-r border-cashmere overflow-y-auto pt-6 pb-8">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-midnight/30" onClick={onClose} />
          <aside className="absolute left-0 top-0 bottom-0 w-[280px] bg-cream border-r border-cashmere overflow-y-auto pt-4 pb-8 shadow-xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}
