import { useState, type CSSProperties } from 'react'
import { ChevronDown, ChevronUp, Pencil, Plus } from 'lucide-react'
import { PersonData, GiftItem } from '../data/gifts'
import {
  giftDirCountNumberProfileClass,
  giftDirCountRowProfileClass,
} from '../lib/giftDirectionTags'
import { GiftCard } from './GiftCard'

const labelClass = 'text-gilded text-[12px] font-medium uppercase mb-1 block'
const labelStyle: CSSProperties = { letterSpacing: '0.14em' }
const valueClass = 'text-midnight text-sm font-medium font-sans'

type GiftFilter = 'all' | 'given' | 'received'

interface PersonProfileProps {
  person: PersonData
  gifts: GiftItem[]
  onEditPerson?: (person: PersonData) => void
  onAddGift?: (personName: string) => void
}

export function PersonProfile({
  person,
  gifts,
  onEditPerson,
  onAddGift,
}: PersonProfileProps) {
  const [giftFilter, setGiftFilter] = useState<GiftFilter>('all')
  const [detailsExpanded, setDetailsExpanded] = useState(false)
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
  const hasDetailFields =
    hasPersonalInfo || hasContactInfo || hasLifeEvents

  const filteredGifts =
    giftFilter === 'all'
      ? personGifts
      : personGifts.filter((g) => g.direction === giftFilter)

  return (
    <div>
      <div className="bg-white">
        {/* Profile header: name block + Given/Received tags; actions */}
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:p-6">
          <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
            <span
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full sm:h-14 sm:w-14 ${person.avatarColor}`}
            >
              <span className="text-base font-semibold text-white sm:text-lg">
                {person.initials}
              </span>
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-row items-start justify-between gap-4 sm:gap-6">
                <div className="min-w-0 flex-1">
                  <h1 className="font-cormorant text-[24px] font-normal leading-tight text-midnight sm:text-[28px]">
                    {person.name}
                  </h1>
                  <p className="mt-0.5 text-xs leading-snug text-gilded">
                    {person.relationship}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col gap-2 sm:gap-2.5">
                  <div className={giftDirCountRowProfileClass('given')}>
                    <span style={{ letterSpacing: '0.12em' }}>Given</span>
                    <span className={giftDirCountNumberProfileClass}>
                      {givenCount}
                    </span>
                  </div>
                  <div className={giftDirCountRowProfileClass('received')}>
                    <span style={{ letterSpacing: '0.12em' }}>Received</span>
                    <span className={giftDirCountNumberProfileClass}>
                      {receivedCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:shrink-0 sm:pt-0.5">
            {onEditPerson && (
              <button
                type="button"
                onClick={() => onEditPerson(person)}
                className="flex items-center gap-2 border border-cashmere px-3 py-1.5 text-xs font-medium uppercase text-gilded transition-colors duration-300 hover:border-midnight/30 hover:text-midnight"
                style={{ letterSpacing: '0.08em' }}
              >
                <Pencil className="h-3.5 w-3.5" strokeWidth={1.6} />
                Edit
              </button>
            )}
            {onAddGift && (
              <button
                type="button"
                onClick={() => onAddGift(person.name)}
                className="flex items-center gap-1.5 bg-midnight px-2.5 py-1 text-[10px] font-medium uppercase text-white transition-all duration-300 hover:bg-midnight/90 hover:shadow-md sm:gap-2 sm:px-3 sm:py-1.5 sm:text-xs lg:px-4"
                style={{ letterSpacing: '0.08em' }}
              >
                <Plus
                  className="h-3 w-3 sm:h-3.5 sm:w-3.5"
                  strokeWidth={2}
                />
                <span className="hidden sm:inline">
                  Add a Gift for {person.name}
                </span>
                <span className="sm:hidden">Add Gift</span>
              </button>
            )}
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex flex-col divide-y divide-bond-blue/35">
            <div className="pb-6">
          <div>
            <button
              type="button"
              onClick={() => setDetailsExpanded(!detailsExpanded)}
              className="flex w-full items-center gap-2 text-gilded transition-colors duration-300 hover:text-midnight"
              aria-expanded={detailsExpanded}
            >
              <span
                className="text-[12px] font-medium uppercase text-gilded"
                style={labelStyle}
              >
                Details
              </span>
              {detailsExpanded ? (
                <ChevronUp className="h-3.5 w-3.5" strokeWidth={1.6} />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.6} />
              )}
            </button>

            {detailsExpanded && (
              <div className="mt-4">
                {hasDetailFields ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {person.birthday && (
                  <div>
                    <p className={labelClass} style={labelStyle}>
                      Birthday
                    </p>
                    <p className={valueClass}>{person.birthday}</p>
                  </div>
                )}
                {person.anniversary && (
                  <div>
                    <p className={labelClass} style={labelStyle}>
                      Anniversary
                    </p>
                    <p className={valueClass}>{person.anniversary}</p>
                  </div>
                )}
                {person.phones && person.phones.length > 0 && (
                  <div>
                    <p className={labelClass} style={labelStyle}>
                      Phone
                    </p>
                    <div className="space-y-1">
                      {person.phones.map((phone, i) => (
                        <p key={i} className={valueClass}>
                          {phone.number}
                          {phone.label && (
                            <span className="ml-1.5 text-xs font-normal text-gilded">
                              {phone.label}
                            </span>
                          )}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
                {person.emails && person.emails.length > 0 && (
                  <div>
                    <p className={labelClass} style={labelStyle}>
                      Email
                    </p>
                    <div className="space-y-1">
                      {person.emails.map((email, i) => (
                        <p key={i} className={`${valueClass} break-all`}>
                          {email}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
                {person.addresses?.length || person.pets?.length ? (
                  <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:gap-6">
                    {person.addresses && person.addresses.length > 0 && (
                      <div className="min-w-0 flex-1">
                        <p className={labelClass} style={labelStyle}>
                          Address
                        </p>
                        <div className="space-y-3">
                          {person.addresses.map((addr, i) => (
                            <div key={i}>
                              <p className={valueClass}>
                                {addr.street}
                                {addr.label && (
                                  <span className="ml-2 inline-flex items-center rounded-full bg-bond-blue/15 px-2 py-0.5 font-sans text-xs font-medium text-bond-blue">
                                    {addr.label}
                                  </span>
                                )}
                              </p>
                              <p className="font-sans text-sm text-midnight/70">
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
                      <div className="min-w-0 flex-1">
                        <p className={labelClass} style={labelStyle}>
                          Pets
                        </p>
                        <div className="space-y-1">
                          {person.pets.map((pet, i) => (
                            <p key={i} className={valueClass}>
                              {pet.name}
                              <span className="font-normal text-gilded">
                                {' '}
                                · {pet.type}
                              </span>
                              {pet.birthday && (
                                <span className="font-normal text-gilded">
                                  {' '}
                                  · {pet.birthday}
                                </span>
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
                    <p className={labelClass} style={labelStyle}>
                      Life Events
                    </p>
                    <div className="space-y-2">
                      {person.lifeEvents.map((event, i) => (
                        <div
                          key={i}
                          className="flex flex-wrap items-baseline gap-2"
                        >
                          <span className={valueClass}>{event.type}</span>
                          <span className="text-xs text-gilded">{event.date}</span>
                          {event.description && (
                            <span className="text-xs italic text-midnight/60">
                              — {event.description}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                  </div>
                ) : (
                  <div className="py-4 text-center sm:py-6">
                    <p className="mb-2 font-cormorant text-[24px] font-normal text-midnight/40">
                      No details yet
                    </p>
                    <p className="text-sm text-gilded">
                      Add personal details for {person.name} to see them here.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
            </div>

          {person.notes ? (
            <div className="py-6">
              <button
                type="button"
                onClick={() => setNotesExpanded(!notesExpanded)}
                className="flex items-center gap-2 text-gilded transition-colors duration-300 hover:text-midnight"
                aria-expanded={notesExpanded}
              >
                <span
                  className="text-[12px] font-medium uppercase text-gilded"
                  style={labelStyle}
                >
                  Notes
                </span>
                {notesExpanded ? (
                  <ChevronUp className="h-3.5 w-3.5" strokeWidth={1.6} />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.6} />
                )}
              </button>
              {notesExpanded ? (
                <p className="mt-2 font-sans text-sm leading-relaxed text-midnight/70">
                  {person.notes}
                </p>
              ) : null}
            </div>
          ) : null}

          <div className="py-6">
        <p
          className="mb-4 text-[12px] font-medium uppercase text-gilded sm:mb-5"
          style={labelStyle}
        >
          Your Gift History with {person.name}
        </p>
        <div
          role="group"
          aria-label="Filter gifts"
          className="mb-5 flex items-center border-b border-bond-blue/35 sm:mb-6"
        >
          {(['all', 'given', 'received'] as GiftFilter[]).map((filter) => {
            const isActive = giftFilter === filter
            const label =
              filter === 'all'
                ? 'All'
                : filter.charAt(0).toUpperCase() + filter.slice(1)
            const activeClass =
              filter === 'all'
                ? 'text-bond-blue'
                : filter === 'given'
                  ? 'text-[#6A7B8C]'
                  : 'text-[#C7B8A5]'
            const barClass =
              filter === 'all'
                ? 'bg-bond-blue'
                : filter === 'given'
                  ? 'bg-[#6A7B8C]'
                  : 'bg-[#C7B8A5]'
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setGiftFilter(filter)}
                className={`relative px-3 pb-2.5 pt-0.5 font-sans text-sm font-normal uppercase transition-all duration-300 sm:px-4 ${
                  isActive
                    ? activeClass
                    : 'text-gilded hover:text-midnight/70'
                }`}
                style={{ letterSpacing: '0.08em' }}
                aria-pressed={isActive}
              >
                {label}
                {isActive && (
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-0.5 ${barClass}`}
                  />
                )}
              </button>
            )
          })}
        </div>
        {filteredGifts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center sm:py-16">
            <p className="mb-2 font-cormorant text-[24px] font-normal text-midnight/40">
              No gifts yet
            </p>
            <p className="text-sm text-gilded">
              {giftFilter === 'all'
                ? `Your gift history with ${person.name} will appear here.`
                : `No ${giftFilter} gifts with ${person.name} yet.`}
            </p>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-6"
            style={{
              gridAutoRows: 'minmax(min(360px, calc(100vh - 260px)), 1fr)',
            }}
          >
            {filteredGifts.map((gift) => (
              <GiftCard
                key={gift.id}
                gift={gift}
                to={`/gifts/${encodeURIComponent(gift.id)}`}
              />
            ))}
          </div>
        )}
          </div>

          </div>
        </div>
      </div>
    </div>
  )
}
