import { useState } from 'react'
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Pencil,
  Plus,
} from 'lucide-react'
import { PersonData, GiftItem } from '../data/gifts'
import { GiftCard } from './GiftCard'
const labelClass = 'text-gilded text-[12px] font-medium uppercase mb-1 block'
const labelStyle: React.CSSProperties = { letterSpacing: '0.14em' }
const valueClass = 'text-midnight text-sm font-medium font-sans'
type ProfileTab = 'details' | 'gifts'
type GiftFilter = 'all' | 'given' | 'received'
interface PersonProfileProps {
  person: PersonData
  gifts: GiftItem[]
  onBack: () => void
  backLabel?: string
  onEditPerson?: (person: PersonData) => void
  onAddGift?: (personName: string) => void
  onGiftClick?: (gift: GiftItem) => void
}
export function PersonProfile({
  person,
  gifts,
  onBack,
  backLabel,
  onEditPerson,
  onAddGift,
  onGiftClick,
}: PersonProfileProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>('details')
  const [giftFilter, setGiftFilter] = useState<GiftFilter>('all')
  const [notesExpanded, setNotesExpanded] = useState(false)
  const personGifts = gifts
    .filter((g) => g.person.name === person.name)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const givenCount = personGifts.filter((g) => g.direction === 'given').length
  const receivedCount = personGifts.filter(
    (g) => g.direction === 'received',
  ).length
  const hasContactInfo =
    person.phones?.length || person.emails?.length || person.addresses?.length
  const hasPersonalInfo =
    person.birthday || person.anniversary || person.pets?.length
  const hasLifeEvents = person.lifeEvents?.length
  return (
    <div>
      {backLabel && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gilded text-sm hover:text-midnight transition-colors duration-300 mb-4 sm:mb-6"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.6} />
          {backLabel}
        </button>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <span
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center flex-shrink-0 ${person.avatarColor}`}
          >
            <span className="text-white text-base sm:text-lg font-semibold">
              {person.initials}
            </span>
          </span>
          <div>
            <h1 className="font-cormorant font-normal text-[24px] sm:text-[28px] text-midnight leading-tight">
              {person.name}
            </h1>
            <p className="text-gilded text-sm">{person.relationship}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:ml-2">
          {onEditPerson && (
            <button
              onClick={() => onEditPerson(person)}
              className="flex items-center gap-2 text-gilded hover:text-midnight text-xs font-medium uppercase transition-colors duration-300 border border-cashmere px-3 py-1.5 hover:border-midnight/30"
              style={{
                letterSpacing: '0.08em',
              }}
            >
              <Pencil className="w-3.5 h-3.5" strokeWidth={1.6} />
              Edit
            </button>
          )}
          {onAddGift && (
            <button
              onClick={() => onAddGift(person.name)}
              className="flex items-center gap-2 bg-bond-blue text-white px-3 sm:px-4 py-1.5 text-xs font-medium uppercase transition-all duration-300 hover:bg-bond-blue/90 hover:shadow-md"
              style={{
                letterSpacing: '0.08em',
              }}
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={2} />
              <span className="hidden sm:inline">
                Add a Gift for {person.name}
              </span>
              <span className="sm:hidden">Add Gift</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 sm:ml-auto">
          <div className="bg-bond-blue/15 px-3 py-1.5 flex items-center gap-1.5">
            <p
              className="text-bond-blue text-[9px] font-medium uppercase"
              style={{
                letterSpacing: '0.12em',
              }}
            >
              Given
            </p>
<p className="font-sans text-xs text-bond-blue font-medium">
            {givenCount}
          </p>
          </div>
          <div className="bg-amber-warm/15 px-3 py-1.5 flex items-center gap-1.5">
            <p
              className="text-amber-warm text-[9px] font-medium uppercase"
              style={{
                letterSpacing: '0.12em',
              }}
            >
              Received
            </p>
<p className="font-sans text-xs text-bond-blue font-medium">
            {receivedCount}
          </p>
          </div>
        </div>
      </div>

      {/* Toggle Tabs */}
      <div
        role="group"
        aria-label="Profile tabs"
        className="inline-flex p-1 border border-cashmere bg-cream w-fit mb-6 sm:mb-8"
      >
        <button
          onClick={() => setActiveTab('details')}
          className={`font-sans text-xs font-light uppercase px-5 sm:px-6 py-2 transition-all duration-300 outline-none hover:opacity-80 ${activeTab === 'details' ? '' : 'bg-white'}`}
          style={activeTab === 'details' ? { backgroundColor: '#1A2530', color: '#FAF9F4', letterSpacing: '2px' } : { color: '#A89885', letterSpacing: '2px' }}
          aria-pressed={activeTab === 'details'}
        >
          Details
        </button>
        <button
          onClick={() => setActiveTab('gifts')}
          className={`font-sans text-xs font-light uppercase px-5 sm:px-6 py-2 transition-all duration-300 outline-none hover:opacity-80 ${activeTab === 'gifts' ? '' : 'bg-white'}`}
          style={activeTab === 'gifts' ? { backgroundColor: '#1A2530', color: '#FAF9F4', letterSpacing: '2px' } : { color: '#A89885', letterSpacing: '2px' }}
          aria-pressed={activeTab === 'gifts'}
        >
          Gift History
        </button>
      </div>

      {activeTab === 'details' && (
        <>
          {hasPersonalInfo ||
          hasContactInfo ||
          hasLifeEvents ||
          person.notes ? (
            <div>
              <p className="text-gilded text-[12px] font-medium uppercase mb-3 sm:mb-4" style={labelStyle}>
                Details
              </p>
              <div className="bg-white border border-cashmere p-5 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {person.birthday && (
                    <div>
                      <p className={labelClass} style={labelStyle}>Birthday</p>
                      <p className={valueClass}>{person.birthday}</p>
                    </div>
                  )}
                  {person.anniversary && (
                    <div>
                      <p className={labelClass} style={labelStyle}>Anniversary</p>
                      <p className={valueClass}>{person.anniversary}</p>
                    </div>
                  )}
                  {person.phones && person.phones.length > 0 && (
                    <div>
                      <p className={labelClass} style={labelStyle}>Phone</p>
                      <div className="space-y-1">
                        {person.phones.map((phone, i) => (
                          <p key={i} className={valueClass}>
                            {phone.number}
                            {phone.label && (
                              <span className="text-gilded font-normal text-xs ml-1.5">{phone.label}</span>
                            )}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                  {person.emails && person.emails.length > 0 && (
                    <div>
                      <p className={labelClass} style={labelStyle}>Email</p>
                      <div className="space-y-1">
                        {person.emails.map((email, i) => (
                          <p key={i} className={`${valueClass} break-all`}>{email}</p>
                        ))}
                      </div>
                    </div>
                  )}
                  {(person.addresses?.length || person.pets?.length) ? (
                    <div className="sm:col-span-2 flex flex-col sm:flex-row gap-4 sm:gap-6">
                      {person.addresses && person.addresses.length > 0 && (
                        <div className="flex-1 min-w-0">
                          <p className={labelClass} style={labelStyle}>Address</p>
                          <div className="space-y-3">
                            {person.addresses.map((addr, i) => (
                              <div key={i}>
                                <p className={valueClass}>
                                  {addr.street}
                                  {addr.label && (
                                    <span className="inline-flex items-center ml-2 px-2 py-0.5 font-sans text-xs font-medium text-bond-blue bg-bond-blue/15 rounded">
                                      {addr.label}
                                    </span>
                                  )}
                                </p>
                                <p className="text-midnight/70 text-sm font-sans">
                                  {addr.city}
                                  {addr.state ? `, ${addr.state}` : ''} {addr.zip}
                                  {addr.country ? ` · ${addr.country}` : ''}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {person.pets && person.pets.length > 0 && (
                        <div className="flex-1 min-w-0">
                          <p className={labelClass} style={labelStyle}>Pets</p>
                          <div className="space-y-1">
                            {person.pets.map((pet, i) => (
                              <p key={i} className={valueClass}>
                                {pet.name}
                                <span className="text-gilded font-normal"> · {pet.type}</span>
                                {pet.birthday && (
                                  <span className="text-gilded font-normal"> · {pet.birthday}</span>
                                )}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : null}
                  {person.lifeEvents && person.lifeEvents.length > 0 && (
                    <div className="sm:col-span-2">
                      <p className={labelClass} style={labelStyle}>Life Events</p>
                      <div className="space-y-2">
                        {person.lifeEvents.map((event, i) => (
                          <div key={i} className="flex flex-wrap items-baseline gap-2">
                            <span className={valueClass}>{event.type}</span>
                            <span className="text-gilded text-xs">{event.date}</span>
                            {event.description && (
                              <span className="text-midnight/60 text-xs italic">— {event.description}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {person.notes && (
                  <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-cashmere">
                    <button
                      onClick={() => setNotesExpanded(!notesExpanded)}
                      className="flex items-center gap-2 text-gilded hover:text-midnight transition-colors duration-300"
                    >
                      <span className="text-gilded text-[12px] font-medium uppercase" style={labelStyle}>Notes</span>
                      {notesExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" strokeWidth={1.6} />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" strokeWidth={1.6} />
                      )}
                    </button>
                    {notesExpanded && (
                      <p className="font-sans text-sm text-midnight/70 leading-relaxed mt-2">{person.notes}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
              <p className="font-cormorant font-normal text-[24px] text-midnight/40 mb-2">
                No details yet
              </p>
              <p className="text-gilded text-sm">
                Add personal details for {person.name} to see them here.
              </p>
            </div>
          )}
        </>
      )}

      {activeTab === 'gifts' && (
        <div>
          <div
            role="group"
            aria-label="Filter gifts"
            className="flex items-center border-b border-cashmere mb-5 sm:mb-6"
          >
            {(['all', 'given', 'received'] as GiftFilter[]).map((filter) => {
              const isActive = giftFilter === filter
              const label = filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)
              return (
                <button
                  key={filter}
                  onClick={() => setGiftFilter(filter)}
                  className={`font-sans text-xs font-medium uppercase px-3 sm:px-4 pb-2.5 pt-0.5 transition-all duration-300 relative ${
                    isActive ? 'text-midnight' : 'text-gilded hover:text-midnight/70'
                  }`}
                  style={{ letterSpacing: '0.08em' }}
                  aria-pressed={isActive}
                >
                  {label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-midnight" />
                  )}
                </button>
              )
            })}
          </div>
          {(() => {
            const filtered =
              giftFilter === 'all'
                ? personGifts
                : personGifts.filter((g) => g.direction === giftFilter)
            return filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
                <p className="font-cormorant font-normal text-[24px] text-midnight/40 mb-2">
                  No gifts yet
                </p>
                <p className="text-gilded text-sm">
                  {giftFilter === 'all'
                    ? `Your gift history with ${person.name} will appear here.`
                    : `No ${giftFilter} gifts with ${person.name} yet.`}
                </p>
              </div>
            ) : (
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
                style={{
                  gridAutoRows: 'minmax(min(360px, calc(100vh - 260px)), 1fr)',
                }}
              >
                {filtered.map((gift) => (
                  <GiftCard key={gift.id} gift={gift} onClick={onGiftClick} />
                ))}
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}
