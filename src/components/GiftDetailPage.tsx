import type { CSSProperties } from 'react'
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  Navigate,
  matchPath,
  useBeforeUnload,
  useBlocker,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import {
  Camera,
  Image as ImageIcon,
  Pencil,
  UploadCloud,
  X,
} from 'lucide-react'
import { GiftItem, GiftPersonalNote, PersonData } from '../data/gifts'
import {
  giftDirPillClass,
  giftDirToggleBtnClass,
} from '../lib/giftDirectionTags'

const OCCASIONS = [
  'Birthday',
  'Anniversary',
  'Christmas',
  "Valentine's Day",
  "Mother's Day",
  "Father's Day",
  'Wedding',
  'Baby Shower',
  'Graduation',
  'Housewarming',
  'Thank You',
  'Just Because',
  'Bon Voyage',
  '40th Birthday',
  'Other',
] as const

const labelStyle: CSSProperties = { letterSpacing: '0.14em' }
const sectionLabelClass =
  'text-gilded text-[12px] font-medium uppercase block font-sans'
const labelClass = `${sectionLabelClass} mb-1.5`
const metaValueClass = 'text-midnight text-sm font-medium font-sans'

/** Matches AddGiftModal field labels and inputs */
const popupLabelClass =
  'text-gilded text-[12px] font-medium uppercase mb-1 block font-sans'
const popupInputClass =
  'w-full bg-white border border-cashmere px-3 py-2 text-sm text-midnight placeholder:text-gilded/50 focus:border-bond-blue focus:outline-none transition-colors'
const popupTextareaClass = `${popupInputClass} min-h-[4.5rem] resize-none`
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

function initialsFromName(name: string): string {
  const p = name.trim().split(/\s+/).filter(Boolean)
  if (p.length === 0) return '?'
  if (p.length === 1) return p[0].slice(0, 2).toUpperCase()
  return (p[0][0] + p[p.length - 1][0]).toUpperCase()
}

function resolvePersonForSave(
  name: string,
  relationship: string,
  fallback: GiftItem['person'],
  people: PersonData[],
): GiftItem['person'] {
  const match = people.find(
    (p) => p.name.toLowerCase() === name.trim().toLowerCase(),
  )
  if (match) {
    return {
      name: match.name,
      initials: match.initials,
      relationship: match.relationship,
      avatarColor: match.avatarColor,
    }
  }
  return {
    name: name.trim() || fallback.name,
    relationship: relationship.trim() || fallback.relationship,
    initials: initialsFromName(name.trim() || fallback.name),
    avatarColor: fallback.avatarColor,
  }
}

function cloneNotesForDraft(gift: GiftItem): GiftPersonalNote[] {
  return resolvedPersonalNotes(gift).map((n) =>
    n.id === LEGACY_NOTE_ID
      ? { ...n, id: crypto.randomUUID() }
      : { ...n },
  )
}

interface GiftDraft {
  name: string
  personName: string
  relationship: string
  occasion: string
  date: string
  direction: 'given' | 'received'
  imageUrl: string
  personalNotes: GiftPersonalNote[]
  pendingNewNote: string
}

function giftToDraft(g: GiftItem): GiftDraft {
  return {
    name: g.name,
    personName: g.person.name,
    relationship: g.person.relationship,
    occasion: g.occasion,
    date: g.date,
    direction: g.direction,
    imageUrl: g.imageUrl ?? '',
    personalNotes: cloneNotesForDraft(g),
    pendingNewNote: '',
  }
}

function draftsEqual(a: GiftDraft, b: GiftDraft): boolean {
  return (
    a.name === b.name &&
    a.personName === b.personName &&
    a.relationship === b.relationship &&
    a.occasion === b.occasion &&
    a.date === b.date &&
    a.direction === b.direction &&
    a.imageUrl === b.imageUrl &&
    a.pendingNewNote === b.pendingNewNote &&
    JSON.stringify(a.personalNotes) === JSON.stringify(b.personalNotes)
  )
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
  const relationshipListId = useId()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const [photoChangeModalOpen, setPhotoChangeModalOpen] = useState(false)
  const [photoDragActive, setPhotoDragActive] = useState(false)

  const routeMatch = matchPath(
    { path: '/gifts/:giftId', end: true },
    pathname,
  )
  const giftId = routeMatch?.params.giftId

  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState<GiftDraft | null>(null)
  const baselineDraftRef = useRef<GiftDraft | null>(null)

  const [draftNote, setDraftNote] = useState('')

  const gift = useMemo(
    () => (giftId ? giftsList.find((g) => g.id === giftId) ?? null : null),
    [giftsList, giftId],
  )

  const isDirty = useMemo(() => {
    if (!isEditing || !draft || !baselineDraftRef.current) return false
    return !draftsEqual(draft, baselineDraftRef.current)
  }, [isEditing, draft])

  const blocker = useBlocker(
    useCallback(
      ({ currentLocation, nextLocation }) =>
        isEditing &&
        isDirty &&
        currentLocation.pathname !== nextLocation.pathname,
      [isEditing, isDirty],
    ),
  )

  useBeforeUnload(
    useCallback(
      (event: BeforeUnloadEvent) => {
        if (isEditing && isDirty) {
          event.preventDefault()
        }
      },
      [isEditing, isDirty],
    ),
  )

  useEffect(() => {
    if (blocker.state !== 'blocked') return
    const leave = window.confirm(
      'You have unsaved changes. Leave this page without saving?',
    )
    if (leave) blocker.proceed()
    else blocker.reset()
  }, [blocker])

  useEffect(() => {
    setIsEditing(false)
    setDraft(null)
    baselineDraftRef.current = null
  }, [giftId])

  useEffect(() => {
    if (!isEditing) {
      setPhotoChangeModalOpen(false)
      setPhotoDragActive(false)
    }
  }, [isEditing])

  useEffect(() => {
    setDraftNote('')
  }, [giftId])

  const displayPersonalNotes = useMemo(
    () => (gift ? resolvedPersonalNotes(gift) : []),
    [gift],
  )

  const relationshipOptions = useMemo(() => {
    const r = new Set(peopleList.map((p) => p.relationship))
    return [...r].sort()
  }, [peopleList])

  const datePickerIsoValue = useMemo(() => {
    if (!draft?.date?.trim()) return ''
    const s = draft.date.trim()
    const withYear = /\d{4}/.test(s) ? s : `${s}, ${new Date().getFullYear()}`
    const t = Date.parse(withYear)
    if (Number.isNaN(t)) return ''
    return new Date(t).toISOString().slice(0, 10)
  }, [draft?.date])

  const beginEdit = () => {
    if (!gift) return
    const next = giftToDraft(gift)
    baselineDraftRef.current = next
    setDraft(next)
    setIsEditing(true)
  }

  const cancelEdit = () => {
    if (!isEditing) return
    if (isDirty) {
      const leave = window.confirm(
        'Discard your unsaved changes?',
      )
      if (!leave) return
    }
    setIsEditing(false)
    setDraft(null)
    baselineDraftRef.current = null
  }

  const saveEdit = () => {
    if (!gift || !draft) return
    const trimmedNotes = draft.personalNotes
      .map((n) => ({ ...n, body: n.body.trim() }))
      .filter((n) => n.body.length > 0)
    const merged: GiftPersonalNote[] = [...trimmedNotes]
    if (draft.pendingNewNote.trim()) {
      merged.push({
        id: crypto.randomUUID(),
        body: draft.pendingNewNote.trim(),
        date: formatNoteDate(),
      })
    }

    const nextPersonal = merged.length > 0 ? merged : undefined
    const nextNotes = merged.length > 0 ? undefined : gift.notes

    onGiftSaved({
      ...gift,
      name: draft.name.trim() || gift.name,
      person: resolvePersonForSave(
        draft.personName,
        draft.relationship,
        gift.person,
        peopleList,
      ),
      occasion: draft.occasion.trim() || gift.occasion,
      date: draft.date.trim() || gift.date,
      direction: draft.direction,
      imageUrl: draft.imageUrl.trim() || undefined,
      personalNotes: nextPersonal,
      notes: nextNotes,
    })
    setIsEditing(false)
    setDraft(null)
    baselineDraftRef.current = null
  }

  const handleSavePersonalNote = () => {
    if (!gift || isEditing) return
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

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const url = e.target?.result as string
      setDraft((d) => (d ? { ...d, imageUrl: url } : d))
      setPhotoChangeModalOpen(false)
      setPhotoDragActive(false)
    }
    reader.readAsDataURL(file)
  }, [])

  useEffect(() => {
    if (!photoChangeModalOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPhotoChangeModalOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [photoChangeModalOpen])

  const handleBack = () => {
    if (isEditing && isDirty) {
      const leave = window.confirm(
        'You have unsaved changes. Leave without saving?',
      )
      if (!leave) return
    }
    navigate(-1)
  }

  if (!giftId) {
    return <Navigate to="/" replace />
  }
  if (!gift) {
    return <Navigate to="/" replace />
  }

  const directionIsGiven =
    (isEditing && draft ? draft.direction : gift.direction) === 'given'
  const directionLabelCaps = directionIsGiven ? 'GIVEN' : 'RECEIVED'
  const personLine = isEditing && draft
    ? `${draft.personName.toUpperCase()} · ${draft.relationship.toUpperCase()}`
    : `${gift.person.name.toUpperCase()} · ${gift.person.relationship.toUpperCase()}`

  const imageSrc = isEditing && draft ? draft.imageUrl : gift.imageUrl

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-cream font-sans">
      <header className="flex shrink-0 flex-wrap items-start justify-between gap-4 border-b border-cashmere px-5 py-4 font-cormorant sm:px-8 sm:py-5">
        <div className="min-w-0 pt-2 sm:pt-2.5">
          <button
            type="button"
            onClick={handleBack}
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
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={cancelEdit}
                className="px-3 py-2 font-sans text-xs font-medium uppercase text-gilded transition-colors duration-300 hover:text-midnight sm:px-4"
                style={labelStyle}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveEdit}
                className="bg-midnight px-5 py-2.5 font-sans text-xs font-medium uppercase text-white transition-all duration-300 hover:bg-midnight/90 hover:shadow-md sm:px-6"
                style={labelStyle}
              >
                Save
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={beginEdit}
              className="flex items-center gap-2 border border-cashmere bg-white px-4 py-2 font-sans text-xs font-medium uppercase text-midnight transition-colors hover:border-midnight/30"
              style={labelStyle}
            >
              Edit
            </button>
          )}
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
        <div className="relative min-w-0 max-lg:h-[min(42vh,380px)] max-lg:max-h-[50vh] max-lg:min-h-[12rem] max-lg:flex-none lg:min-h-0 lg:flex-1 lg:w-1/2 lg:max-w-[50%]">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt=""
              className="absolute inset-0 h-full w-full rounded-none object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-midnight">
              <span className="text-8xl opacity-40" aria-hidden>
                {gift.emoji}
              </span>
            </div>
          )}

          {isEditing && draft && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) handleFileSelect(f)
                  e.target.value = ''
                }}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) handleFileSelect(f)
                  e.target.value = ''
                }}
              />
              <button
                type="button"
                onClick={() => setPhotoChangeModalOpen(true)}
                className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-none bg-midnight text-white shadow-md transition-colors hover:bg-midnight/90 active:bg-midnight/85 lg:hidden"
                aria-label={
                  draft.imageUrl ? 'Change photo' : 'Add photo'
                }
              >
                <Pencil className="h-4 w-4" strokeWidth={2} />
              </button>

              {photoChangeModalOpen ? (
                <div
                  className="absolute inset-0 z-40 flex items-center justify-center bg-midnight/50 p-4 sm:p-6"
                  onClick={() => setPhotoChangeModalOpen(false)}
                  role="presentation"
                >
                  <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="gift-photo-change-title"
                    className="relative w-full max-w-md rounded-none border border-cashmere bg-[#faf9f4] p-5 shadow-xl sm:p-6"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => setPhotoChangeModalOpen(false)}
                      className="absolute right-3 top-3 text-gilded transition-colors hover:text-midnight"
                      aria-label="Close"
                    >
                      <X className="h-5 w-5" strokeWidth={1.6} />
                    </button>
                    <h3
                      id="gift-photo-change-title"
                      className="pr-10 font-cormorant text-xl font-normal text-midnight sm:text-2xl"
                    >
                      {draft.imageUrl ? 'Change photo' : 'Add a photo'}
                    </h3>
                    <p className="mt-1 font-sans text-sm text-gilded">
                      {draft.imageUrl
                        ? 'Replace the gift image.'
                        : 'Add an image for this gift.'}
                    </p>

                    <div className="mt-5 hidden sm:block">
                      <div
                        onDragOver={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setPhotoDragActive(true)
                        }}
                        onDragLeave={() => setPhotoDragActive(false)}
                        onDrop={(e) => {
                          e.preventDefault()
                          setPhotoDragActive(false)
                          const file = e.dataTransfer.files?.[0]
                          if (file) handleFileSelect(file)
                        }}
                        className={`flex cursor-pointer flex-col items-center justify-center rounded-none border-2 border-dashed px-4 py-10 transition-colors ${
                          photoDragActive
                            ? 'border-bond-blue bg-bond-blue/5'
                            : 'border-cashmere bg-white hover:border-bond-blue/40'
                        }`}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <UploadCloud
                          className="mb-3 h-10 w-10 text-gilded/40"
                          strokeWidth={1.2}
                        />
                        <p className="text-center font-sans text-sm font-medium text-midnight">
                          Drag and drop an image here
                        </p>
                        <p className="mt-2 font-sans text-xs text-gilded">or</p>
                        <button
                          type="button"
                          className="mt-3 rounded-none bg-bond-blue px-4 py-2 font-sans text-xs font-medium uppercase tracking-[0.14em] text-white transition-colors hover:bg-bond-blue/90"
                          style={labelStyle}
                          onClick={(e) => {
                            e.stopPropagation()
                            fileInputRef.current?.click()
                          }}
                        >
                          Choose from computer
                        </button>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-3 sm:hidden">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex w-full items-center justify-center gap-2.5 rounded-none bg-bond-blue px-4 py-3.5 font-sans text-[15px] font-medium text-white transition-colors active:bg-bond-blue/90"
                      >
                        <ImageIcon
                          className="h-5 w-5 shrink-0"
                          strokeWidth={1.6}
                        />
                        Pick photo from camera roll
                      </button>
                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className="flex w-full items-center justify-center gap-2.5 rounded-none border border-cashmere bg-white px-4 py-3.5 font-sans text-[15px] font-medium text-midnight transition-colors active:bg-cream"
                      >
                        <Camera
                          className="h-5 w-5 shrink-0"
                          strokeWidth={1.6}
                        />
                        Take photo
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="absolute bottom-0 left-0 right-0 z-20 hidden border-t border-cashmere bg-white px-4 pb-4 pt-4 sm:px-6 sm:pb-6 sm:pt-5 lg:block">
                <div className="mx-auto flex w-full max-w-md justify-center sm:max-w-none">
                  <button
                    type="button"
                    onClick={() => setPhotoChangeModalOpen(true)}
                    className="flex w-full items-center justify-center gap-2 bg-midnight px-4 py-2.5 font-sans text-xs font-medium uppercase tracking-[0.14em] text-white transition-colors hover:bg-midnight/90 sm:w-auto sm:min-w-[12rem]"
                    style={labelStyle}
                  >
                    {draft.imageUrl ? 'Change photo' : 'Add photo'}
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="pointer-events-none absolute left-0 top-0 z-10 flex flex-wrap gap-2 p-4 sm:p-6">
            <span className={giftDirPillClass(directionIsGiven)}>
              {directionLabelCaps}
            </span>
          </div>
        </div>

        <div className="flex min-h-0 min-w-0 max-lg:flex-none flex-1 flex-col border-t border-cashmere bg-cream lg:w-1/2 lg:max-w-[50%] lg:border-l lg:border-t-0">
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-8 sm:px-10 sm:py-10 max-lg:flex-none max-lg:overflow-visible lg:overflow-y-auto">
            {isEditing && draft ? (
              <>
                <div className="min-w-0">
                  <span className={popupLabelClass} style={labelStyle}>
                    From
                  </span>
                  <div className="mt-2 min-w-0 space-y-2">
                    <label className="sr-only" htmlFor="person-name">
                      Person name
                    </label>
                    <input
                      id="person-name"
                      type="text"
                      list={relationshipListId}
                      value={draft.personName}
                      onChange={(e) =>
                        setDraft((d) =>
                          d ? { ...d, personName: e.target.value } : d,
                        )
                      }
                      placeholder="Name"
                      className={popupInputClass}
                    />
                    <datalist id={relationshipListId}>
                      {peopleList.map((p) => (
                        <option key={p.name} value={p.name}>
                          {p.relationship}
                        </option>
                      ))}
                    </datalist>
                    <label className="sr-only" htmlFor="relationship">
                      Relationship
                    </label>
                    <input
                      id="relationship"
                      type="text"
                      list={`${relationshipListId}-rel`}
                      value={draft.relationship}
                      onChange={(e) =>
                        setDraft((d) =>
                          d ? { ...d, relationship: e.target.value } : d,
                        )
                      }
                      placeholder="Relationship"
                      className={popupInputClass}
                    />
                    <datalist id={`${relationshipListId}-rel`}>
                      {relationshipOptions.map((r) => (
                        <option key={r} value={r} />
                      ))}
                    </datalist>
                  </div>
                </div>

                <p className="mt-8 font-sans text-[11px] font-medium uppercase leading-normal tracking-[0.14em] text-bond-blue/90 sm:mt-10">
                  {personLine}
                </p>
                <label htmlFor="gift-name" className="sr-only">
                  Gift name
                </label>
                <input
                  id="gift-name"
                  type="text"
                  value={draft.name}
                  onChange={(e) =>
                    setDraft((d) =>
                      d ? { ...d, name: e.target.value } : d,
                    )
                  }
                  placeholder="Gift name"
                  className={`${popupInputClass} mt-2 max-w-full`}
                />

                <div className="mt-5 space-y-3 sm:mt-6">
                  <div>
                    <label
                      className={popupLabelClass}
                      style={labelStyle}
                      htmlFor="gift-occasion-inline"
                    >
                      Occasion
                    </label>
                    <select
                      id="gift-occasion-inline"
                      value={
                        (OCCASIONS as readonly string[]).includes(
                          draft.occasion,
                        )
                          ? draft.occasion
                          : 'Other'
                      }
                      onChange={(e) =>
                        setDraft((d) =>
                          d
                            ? {
                                ...d,
                                occasion:
                                  e.target.value === 'Other'
                                    ? ''
                                    : e.target.value,
                              }
                            : d,
                        )
                      }
                      className={`${popupInputClass} cursor-pointer`}
                    >
                      {OCCASIONS.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  {!(OCCASIONS as readonly string[]).includes(
                    draft.occasion,
                  ) ? (
                    <div>
                      <label
                        className={popupLabelClass}
                        style={labelStyle}
                        htmlFor="gift-occasion-custom"
                      >
                        Custom occasion
                      </label>
                      <input
                        id="gift-occasion-custom"
                        type="text"
                        value={draft.occasion}
                        onChange={(e) =>
                          setDraft((d) =>
                            d ? { ...d, occasion: e.target.value } : d,
                          )
                        }
                        className={popupInputClass}
                        placeholder="Occasion"
                      />
                    </div>
                  ) : null}
                  <div>
                    <label
                      className={popupLabelClass}
                      style={labelStyle}
                      htmlFor="gift-date-inline"
                    >
                      Date
                    </label>
                    <input
                      id="gift-date-inline"
                      type="date"
                      value={datePickerIsoValue}
                      onChange={(e) => {
                        const v = e.target.value
                        if (!v) {
                          setDraft((cur) =>
                            cur ? { ...cur, date: '' } : cur,
                          )
                          return
                        }
                        const picked = new Date(`${v}T12:00:00`)
                        const display = picked.toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                        })
                        setDraft((cur) =>
                          cur ? { ...cur, date: display } : cur,
                        )
                      }}
                      className={popupInputClass}
                    />
                  </div>
                </div>

                <p
                  className={`${sectionLabelClass} mt-7`}
                  style={labelStyle}
                >
                  Gift details
                </p>
                <div className="mt-3 sm:mt-3">
                  <p className="mb-1 font-sans text-[11px] font-medium normal-case text-gilded">
                    Given or received?
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setDraft((d) =>
                          d ? { ...d, direction: 'given' } : d,
                        )
                      }
                      className={giftDirToggleBtnClass(
                        'given',
                        draft.direction === 'given',
                      )}
                      style={labelStyle}
                    >
                      GIVEN
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setDraft((d) =>
                          d ? { ...d, direction: 'received' } : d,
                        )
                      }
                      className={giftDirToggleBtnClass(
                        'received',
                        draft.direction === 'received',
                      )}
                      style={labelStyle}
                    >
                      RECEIVED
                    </button>
                  </div>
                </div>

                <section
                  className="mt-7"
                  aria-labelledby="personal-notes-heading"
                >
                  <div className="flex items-center gap-3">
                    <h2
                      id="personal-notes-heading"
                      className="shrink-0 font-sans text-[12px] font-medium uppercase tracking-[0.14em] text-gilded"
                      style={labelStyle}
                    >
                      Personal notes
                    </h2>
                    <span
                      className="h-px min-w-[2rem] flex-1 bg-cashmere"
                      aria-hidden
                    />
                  </div>

                  {draft.personalNotes.length > 0 ? (
                    <ul className="mt-4 list-none space-y-4 p-0">
                      {draft.personalNotes.map((n, idx) => (
                        <li key={n.id}>
                          <label className="sr-only" htmlFor={`note-${n.id}`}>
                            Note {idx + 1}
                          </label>
                          <textarea
                            id={`note-${n.id}`}
                            value={n.body}
                            onChange={(e) => {
                              const v = e.target.value
                              setDraft((d) => {
                                if (!d) return d
                                const next = [...d.personalNotes]
                                next[idx] = { ...next[idx], body: v }
                                return { ...d, personalNotes: next }
                              })
                            }}
                            rows={3}
                            placeholder="Write a note…"
                            className={popupTextareaClass}
                          />
                          <div className="mt-2 flex items-center justify-between">
                            <span className="font-sans text-[11px] font-light italic text-gilded/60">
                              {n.date}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setDraft((d) => {
                                  if (!d) return d
                                  return {
                                    ...d,
                                    personalNotes: d.personalNotes.filter(
                                      (_, i) => i !== idx,
                                    ),
                                  }
                                })
                              }
                              className="font-sans text-xs text-gilded transition-colors hover:text-midnight"
                            >
                              Remove
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-5 font-sans text-sm font-light text-gilded">
                      No notes yet — add one below.
                    </p>
                  )}

                  <div className="mt-5">
                    <label
                      htmlFor="pending-personal-note"
                      className="sr-only"
                    >
                      Add another note
                    </label>
                    <textarea
                      id="pending-personal-note"
                      value={draft.pendingNewNote}
                      onChange={(e) =>
                        setDraft((d) =>
                          d ? { ...d, pendingNewNote: e.target.value } : d,
                        )
                      }
                      rows={4}
                      placeholder="Add a new note…"
                      className={popupTextareaClass}
                    />
                  </div>
                </section>
              </>
            ) : (
              <>
                <p className="font-sans text-[11px] font-medium uppercase leading-normal tracking-[0.14em] text-bond-blue/90">
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
                  className="text-gilded text-[12px] font-medium uppercase"
                  style={labelStyle}
                >
                  Gift details
                </p>
                <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-8">
                  <div>
                    <span className={labelClass} style={labelStyle}>
                      Direction
                    </span>
                    <p className="mt-1.5">
                      <span className={giftDirPillClass(directionIsGiven)}>
                        {directionLabelCaps}
                      </span>
                    </p>
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
                  <div className="col-span-2">
                    <span className={labelClass} style={labelStyle}>
                      From
                    </span>
                    <div className="mt-2 space-y-1">
                      <p className={metaValueClass}>{gift.person.name}</p>
                      <p className="font-sans text-sm font-light text-gilded">
                        {gift.person.relationship}
                      </p>
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
                      className="shrink-0 font-sans text-[12px] font-medium uppercase tracking-[0.14em] text-gilded"
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
                          <figure className="relative overflow-hidden rounded-none border border-cashmere bg-white pl-1 pr-5 py-4 sm:pr-6 sm:py-5">
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
                      className={popupTextareaClass}
                    />
                    <div className="mt-3 flex justify-end">
                      <button
                        type="button"
                        onClick={handleSavePersonalNote}
                        disabled={!draftNote.trim()}
                        className="bg-midnight px-5 py-2.5 font-sans text-xs font-medium uppercase text-white transition-all duration-300 hover:bg-midnight/90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
                        style={labelStyle}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </section>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
