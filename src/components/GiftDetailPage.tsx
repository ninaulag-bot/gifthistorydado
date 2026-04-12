import type { CSSProperties } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { Navigate, matchPath, useLocation, useNavigate } from 'react-router-dom'
import { GiftItem, GiftPersonalNote, PersonData } from '../data/gifts'
import { GiftEditForm } from './GiftEditForm'

const labelStyle: CSSProperties = { letterSpacing: '0.14em' }
const labelClass =
  'text-gilded text-[10px] font-medium uppercase mb-1.5 block font-sans'
const metaValueClass = 'text-midnight text-sm font-medium font-sans'

type PhotoTab = 'link' | 'upload' | 'current'

const LEGACY_NOTE_ID = '__legacy'

function formatNoteDate(d = new Date()) {
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
}

function resolvedPersonalNotes(gift: GiftItem): GiftPersonalNote[] {
  if (gift.personalNotes?.length) return gift.personalNotes
  if (gift.notes?.trim()) {
    return [
      {
        id: LEGACY_NOTE_ID,
        body: gift.notes.trim(),
        date: gift.date,
      },
    ]
  }
  return []
}

export interface GiftDetailPageProps {
  giftsList: GiftItem[]
  peopleList: PersonData[]
  onGiftSaved: (gift: GiftItem) => void
}

export function GiftDetailPage({
  giftsList,
  peopleList,
  onGiftSaved,
}: GiftDetailPageProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const routeMatch = matchPath(
    { path: '/gifts/:giftId', end: true },
    pathname,
  )
  const giftId = routeMatch?.params.giftId

  const [isEditing, setIsEditing] = useState(false)

  const gift = useMemo(
    () => (giftId ? giftsList.find((g) => g.id === giftId) ?? null : null),
    [giftsList, giftId],
  )

  const [photoTab, setPhotoTab] = useState<PhotoTab>('link')
  const [draftNote, setDraftNote] = useState('')

  useEffect(() => {
    if (gift?.imageUrl) setPhotoTab('current')
    else setPhotoTab('link')
  }, [giftId, gift?.imageUrl])

  useEffect(() => {
    setIsEditing(false)
  }, [giftId])

  useEffect(() => {
    setDraftNote('')
  }, [giftId])

  const tabNote = useMemo(() => {
    if (!gift) return ''
    if (photoTab === 'link') {
      return 'Paste a product link to fetch details and imagery from the retailer when supported.'
    }
    if (photoTab === 'upload') {
      return 'Upload a photo from your device to replace the archive image for this gift.'
    }
    if (gift.source === 'dado') {
      return 'Current source: DADO Platform. Fetched automatically from your linked purchase and kept in sync where available.'
    }
    return 'Current source: your photo or manual entry. You can replace it using the tabs above.'
  }, [photoTab, gift])

  const displayPersonalNotes = useMemo(
    () => (gift ? resolvedPersonalNotes(gift) : []),
    [gift],
  )

  const handleSavePersonalNote = () => {
    if (!gift) return
    const text = draftNote.trim()
    if (!text) return

    const newEntry: GiftPersonalNote = {
      id: crypto.randomUUID(),
      body: text,
      date: formatNoteDate(),
    }

    const hadPersonal = Boolean(gift.personalNotes?.length)
    const legacyOnly =
      !hadPersonal &&
      Boolean(gift.notes?.trim()) &&
      displayPersonalNotes.some((n) => n.id === LEGACY_NOTE_ID)

    let nextPersonal: GiftPersonalNote[]
    let nextNotes: string | undefined = gift.notes

    if (legacyOnly && gift.notes?.trim()) {
      nextPersonal = [
        {
          id: crypto.randomUUID(),
          body: gift.notes.trim(),
          date: gift.date,
        },
        newEntry,
      ]
      nextNotes = undefined
    } else if (hadPersonal) {
      nextPersonal = [...(gift.personalNotes as GiftPersonalNote[]), newEntry]
    } else {
      nextPersonal = [newEntry]
    }

    onGiftSaved({ ...gift, personalNotes: nextPersonal, notes: nextNotes })
    setDraftNote('')
  }

  if (!giftId) {
    return <Navigate to="/" replace />
  }
  if (!gift) {
    return <Navigate to="/" replace />
  }

  const directionLabel = gift.direction === 'given' ? 'Given' : 'Received'
  const directionPillClass =
    gift.direction === 'given'
      ? 'bg-bond-blue/15 text-bond-blue'
      : 'bg-amber-warm/15 text-amber-warm'
  const sourcePillText =
    gift.source === 'dado' ? 'DADO PLATFORM' : 'MANUAL ENTRY'
  const sourceValue =
    gift.source === 'dado' ? 'DADO Platform' : 'Manually added'
  const personLine = `${gift.person.name.toUpperCase()} · ${gift.person.relationship.toUpperCase()}`

  const handleViewOnDado = () => {
    window.open('https://dado.com', '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-cream font-sans">
      <header className="flex shrink-0 flex-wrap items-start justify-between gap-4 border-b border-cashmere px-5 py-4 font-cormorant sm:px-8 sm:py-5">
        <div className="min-w-0 pt-2 sm:pt-2.5">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-light uppercase tracking-[0.12em] text-gilded transition-colors hover:text-midnight/70"
            aria-label="Go back"
          >
            <span className="text-base leading-none" aria-hidden>
              ←
            </span>
            Back
          </button>
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 pt-2 sm:gap-3 sm:pt-2.5">
          <button
            type="button"
            onClick={() => setIsEditing((e) => !e)}
            className="border border-cashmere bg-transparent px-3 py-1.5 text-xs font-medium uppercase text-midnight transition-all duration-300 hover:border-midnight/30 sm:px-4 sm:py-2"
            style={labelStyle}
          >
            {isEditing ? 'CLOSE' : 'EDIT'}
          </button>
          <button
            type="button"
            onClick={handleViewOnDado}
            disabled={gift.source !== 'dado'}
            className="bg-bond-blue px-3 py-1.5 text-xs font-medium uppercase text-white transition-all duration-300 hover:bg-bond-blue/90 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:py-2"
            style={labelStyle}
          >
            View on Dado
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="relative flex min-h-[42vh] min-w-0 flex-1 flex-col bg-midnight/95 lg:min-h-0 lg:w-1/2 lg:max-w-[50%]">
          <div className="relative min-h-[42vh] flex-1 overflow-hidden lg:min-h-0">
            {gift.imageUrl ? (
              <img
                src={gift.imageUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-midnight">
                <span className="text-8xl opacity-40" aria-hidden>
                  {gift.emoji}
                </span>
              </div>
            )}
            <div className="pointer-events-none absolute left-4 top-4 z-10 flex flex-wrap gap-2 sm:left-6 sm:top-6">
              <span
                className={`rounded-sm px-2.5 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.12em] ${directionPillClass}`}
              >
                {directionLabel}
              </span>
              <span className="rounded-sm bg-white/20 px-2.5 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.12em] text-white backdrop-blur-[2px]">
                {sourcePillText}
              </span>
            </div>
          </div>

          <div className="shrink-0 border-t border-bond-blue/25 bg-bond-blue/[0.22] px-4 py-4 sm:px-6 sm:py-5">
            <div
              className="flex flex-wrap gap-x-6 gap-y-2 border-b border-bond-blue/30 pb-3"
              role="tablist"
              aria-label="Photo source"
            >
              {(
                [
                  { id: 'link' as const, label: 'Link a product' },
                  { id: 'upload' as const, label: 'Upload my photo' },
                  { id: 'current' as const, label: 'Current photo' },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={photoTab === t.id}
                  onClick={() => setPhotoTab(t.id)}
                  className={`font-sans text-[10px] font-medium uppercase tracking-[0.14em] transition-colors ${
                    photoTab === t.id
                      ? 'border-b-2 border-bond-blue pb-1 text-midnight'
                      : 'pb-1 text-midnight/45 hover:text-midnight/70'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <p className="mt-3 max-w-prose font-sans text-[11px] font-light leading-relaxed text-midnight/55">
              {tabNote}
            </p>
          </div>
        </div>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col border-t border-cashmere bg-cream lg:w-1/2 lg:max-w-[50%] lg:border-l lg:border-t-0">
          {isEditing ? (
            <GiftEditForm
              key={gift.id}
              gift={gift}
              people={peopleList}
              onSave={(updated) => {
                onGiftSaved(updated)
                setIsEditing(false)
              }}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-8 sm:px-10 sm:py-10">
              <p className="font-sans text-[11px] font-light uppercase leading-normal tracking-[0.14em] text-bond-blue/90">
                {personLine}
              </p>
              <h1 className="mt-3 max-w-[18ch] font-cormorant text-[clamp(2rem,4vw,3.5rem)] font-light leading-[1.05] tracking-tight text-midnight">
                {gift.name}
              </h1>
              <p className="mt-3 font-sans text-sm font-light text-gilded">
                {gift.occasion} · {gift.date}
              </p>

              <hr className="my-8 border-0 border-t border-cashmere" />

              <p
                className="text-gilded text-[10px] font-medium uppercase"
                style={labelStyle}
              >
                Gift details
              </p>
              <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-8">
                <div>
                  <span className={labelClass} style={labelStyle}>
                    Direction
                  </span>
                  <p className={metaValueClass}>{directionLabel}</p>
                </div>
                <div>
                  <span className={labelClass} style={labelStyle}>
                    Occasion
                  </span>
                  <p className={metaValueClass}>{gift.occasion}</p>
                </div>
                <div>
                  <span className={labelClass} style={labelStyle}>
                    Date
                  </span>
                  <p className={metaValueClass}>{gift.date}</p>
                </div>
                <div>
                  <span className={labelClass} style={labelStyle}>
                    Source
                  </span>
                  <p className={metaValueClass}>{sourceValue}</p>
                </div>
                <div className="col-span-2">
                  <span className={labelClass} style={labelStyle}>
                    From
                  </span>
                  <div className="mt-2 flex items-start gap-3">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${gift.person.avatarColor}`}
                    >
                      <span className="text-sm font-semibold text-white">
                        {gift.person.initials}
                      </span>
                    </span>
                    <div>
                      <p className={metaValueClass}>{gift.person.name}</p>
                      <p className="mt-0.5 font-sans text-xs font-light text-gilded">
                        {gift.person.relationship}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="my-8 border-0 border-t border-cashmere" />

              <section
                className="mt-2"
                aria-labelledby="personal-notes-heading"
              >
                <div className="flex items-center gap-3">
                  <h2
                    id="personal-notes-heading"
                    className="shrink-0 font-sans text-[10px] font-medium uppercase tracking-[0.14em] text-gilded"
                    style={labelStyle}
                  >
                    Personal notes
                  </h2>
                  <span
                    className="h-px min-w-[2rem] flex-1 bg-cashmere"
                    aria-hidden
                  />
                </div>

                {displayPersonalNotes.length > 0 ? (
                  <ul className="mt-6 list-none space-y-4 p-0">
                    {displayPersonalNotes.map((n) => (
                      <li key={n.id}>
                        <figure className="relative overflow-hidden rounded-sm border border-cashmere bg-[#EAE9E4]/95 pl-1 pr-5 py-4 sm:pr-6 sm:py-5">
                          <span
                            className="absolute left-0 top-0 h-full w-1 bg-bond-blue"
                            aria-hidden
                          />
                          <blockquote className="pl-4 font-cormorant text-base font-light not-italic leading-relaxed text-midnight/90 sm:text-lg">
                            {n.body}
                          </blockquote>
                          <figcaption className="mt-4 pl-4 font-sans text-[11px] font-light text-gilded">
                            {n.date}
                          </figcaption>
                        </figure>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-5 font-sans text-sm font-light text-gilded">
                    No notes yet — add one below.
                  </p>
                )}

                <div className="mt-8">
                  <label htmlFor="new-personal-note" className="sr-only">
                    Add a new note
                  </label>
                  <textarea
                    id="new-personal-note"
                    value={draftNote}
                    onChange={(e) => setDraftNote(e.target.value)}
                    rows={4}
                    placeholder="Add a new note…"
                    className="w-full resize-y border border-cashmere bg-white px-4 py-3 font-cormorant text-base font-light italic leading-relaxed text-midnight placeholder:text-gilded/45 placeholder:italic focus:border-bond-blue focus:outline-none sm:px-5 sm:py-4"
                  />
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={handleSavePersonalNote}
                      disabled={!draftNote.trim()}
                      className="bg-midnight px-5 py-2.5 font-sans text-[10px] font-medium uppercase tracking-[0.14em] text-white transition-colors duration-300 hover:bg-midnight/90 disabled:cursor-not-allowed disabled:opacity-40"
                      style={labelStyle}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
