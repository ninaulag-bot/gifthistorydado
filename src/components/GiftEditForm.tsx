import React, { useState, useRef, useMemo, type CSSProperties } from 'react'
import { X, UploadCloud, Camera } from 'lucide-react'
import { GiftItem, PersonData } from '../data/gifts'

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
]

const labelClass = 'text-gilded text-[10px] font-medium uppercase mb-1 block'
const labelStyle: CSSProperties = {
  letterSpacing: '0.14em',
}
const inputClass =
  'w-full bg-white border border-cashmere px-3 py-2 text-sm text-midnight placeholder:text-gilded/50 focus:border-bond-blue focus:outline-none transition-colors'
const sectionLabelClass = 'text-gilded text-[10px] font-medium uppercase'
const hintClass = 'text-gilded/60 text-[11px] mt-1 italic'

export interface GiftEditFormProps {
  gift: GiftItem
  people?: PersonData[]
  onSave: (updatedGift: GiftItem) => void
  onCancel: () => void
}

export function GiftEditForm({
  gift,
  people = [],
  onSave,
  onCancel,
}: GiftEditFormProps) {
  const [editName, setEditName] = useState(gift.name)
  const [editDirection, setEditDirection] = useState<'given' | 'received'>(
    gift.direction,
  )
  const [editOccasion, setEditOccasion] = useState(gift.occasion)
  const [editDate, setEditDate] = useState(gift.date)
  const [editNotes, setEditNotes] = useState(gift.notes || '')
  const [recipientQuery, setRecipientQuery] = useState(gift.person.name)
  const [selectedPerson, setSelectedPerson] = useState(gift.person.name)
  const [showRecipientDropdown, setShowRecipientDropdown] = useState(false)
  const [editPerson, setEditPerson] = useState<GiftItem['person'] | null>(
    gift.person,
  )
  const recipientInputRef = useRef<HTMLDivElement>(null)
  const [editImageUrl, setEditImageUrl] = useState(gift.imageUrl || '')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const filteredPeople = useMemo(() => {
    if (!recipientQuery.trim()) return people
    const q = recipientQuery.toLowerCase()
    return people.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.relationship.toLowerCase().includes(q),
    )
  }, [recipientQuery, people])

  const resetToGift = () => {
    setEditName(gift.name)
    setEditDirection(gift.direction)
    setEditOccasion(gift.occasion)
    setEditDate(gift.date)
    setEditNotes(gift.notes || '')
    setRecipientQuery(gift.person.name)
    setSelectedPerson(gift.person.name)
    setEditPerson(gift.person)
    setShowRecipientDropdown(false)
    setEditImageUrl(gift.imageUrl || '')
    setIsDragging(false)
  }

  const handleSelectPerson = (p: PersonData) => {
    setSelectedPerson(p.name)
    setRecipientQuery(p.name)
    setEditPerson({
      name: p.name,
      initials: p.initials,
      relationship: p.relationship,
      avatarColor: p.avatarColor,
    })
    setShowRecipientDropdown(false)
  }

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      setEditImageUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFileSelect(file)
  }

  const handleSave = () => {
    const updated: GiftItem = {
      ...gift,
      name: editName,
      direction: editDirection,
      occasion: editOccasion,
      date: editDate,
      notes: editNotes || undefined,
      personalNotes: gift.personalNotes,
      person: editPerson || gift.person,
      imageUrl: editImageUrl || undefined,
    }
    onSave(updated)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
        <div>
          <p className={sectionLabelClass} style={labelStyle}>
            Gift Details
          </p>
          <div className="mt-3 space-y-4 sm:mt-4">
            <div>
              <label className={labelClass} style={labelStyle}>
                Direction
              </label>
              <div className="flex w-fit items-center gap-1 bg-cashmere/30 p-1">
                <button
                  type="button"
                  onClick={() => setEditDirection('given')}
                  className={`px-4 py-2 text-xs font-medium uppercase transition-all duration-300 sm:px-5 ${editDirection === 'given' ? 'bg-midnight text-white shadow-sm' : 'text-gilded hover:text-midnight'}`}
                  style={labelStyle}
                >
                  Given
                </button>
                <button
                  type="button"
                  onClick={() => setEditDirection('received')}
                  className={`px-4 py-2 text-xs font-medium uppercase transition-all duration-300 sm:px-5 ${editDirection === 'received' ? 'bg-midnight text-white shadow-sm' : 'text-gilded hover:text-midnight'}`}
                  style={labelStyle}
                >
                  Received
                </button>
              </div>
            </div>

            <div ref={recipientInputRef} className="relative">
              <label className={labelClass} style={labelStyle}>
                {editDirection === 'given' ? 'Gift Recipient' : 'Gift From'}{' '}
                <span
                  className="text-bond-blue normal-case"
                  style={{
                    letterSpacing: '0.02em',
                    fontSize: '9px',
                  }}
                >
                  (required)
                </span>
              </label>
              <input
                type="text"
                value={recipientQuery}
                onChange={(e) => {
                  setRecipientQuery(e.target.value)
                  setSelectedPerson('')
                  setShowRecipientDropdown(true)
                }}
                onFocus={() => setShowRecipientDropdown(true)}
                placeholder="Start typing a name…"
                className={inputClass}
              />
              {selectedPerson && (
                <p className={hintClass}>
                  ✓{' '}
                  {people.find((p) => p.name === selectedPerson)?.relationship ||
                    editPerson?.relationship ||
                    'Connection'}
                </p>
              )}
              {showRecipientDropdown && recipientQuery.trim() !== '' && (
                <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-48 overflow-y-auto border border-cashmere bg-white shadow-lg">
                  {filteredPeople.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => handleSelectPerson(p)}
                      className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors duration-200 hover:bg-cream"
                    >
                      <span
                        className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${p.avatarColor}`}
                      >
                        <span className="text-[10px] font-semibold text-white">
                          {p.initials}
                        </span>
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-midnight">
                          {p.name}
                        </p>
                        <p className="text-xs text-gilded">{p.relationship}</p>
                      </div>
                    </button>
                  ))}
                  {filteredPeople.length === 0 && (
                    <div className="px-3 py-3 text-center text-xs text-gilded">
                      No matches found
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className={labelClass} style={labelStyle}>
                Occasion
              </label>
              <select
                value={editOccasion}
                onChange={(e) => setEditOccasion(e.target.value)}
                className={inputClass}
              >
                <option value="">Select an occasion…</option>
                {OCCASIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
                {!OCCASIONS.includes(editOccasion) && editOccasion && (
                  <option value={editOccasion}>{editOccasion}</option>
                )}
              </select>
            </div>

            <div>
              <label className={labelClass} style={labelStyle}>
                Date
              </label>
              <input
                type="text"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                placeholder="e.g. November 15, 2025"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass} style={labelStyle}>
                The Gift{' '}
                <span
                  className="text-bond-blue normal-case"
                  style={{
                    letterSpacing: '0.02em',
                    fontSize: '9px',
                  }}
                >
                  (required)
                </span>
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="e.g. Candle, silk scarf"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass} style={labelStyle}>
                My description
              </label>
              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                rows={4}
                placeholder="Private notes about this gift…"
                className={`${inputClass} min-h-[100px] resize-y font-cormorant text-sm italic leading-relaxed`}
              />
            </div>

            <div>
              <label className={labelClass} style={labelStyle}>
                + Add Photo (Take or Upload)
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileInputChange}
                className="hidden"
              />

              {editImageUrl ? (
                <div className="flex items-center gap-4 border border-cashmere bg-white p-5">
                  <img
                    src={editImageUrl}
                    alt={editName}
                    className="h-16 w-16 flex-shrink-0 object-cover sm:h-20 sm:w-20"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-midnight">
                      {editName}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditImageUrl('')}
                    className="flex-shrink-0 text-gilded/50 transition-colors hover:text-gilded"
                  >
                    <X className="h-4 w-4" strokeWidth={1.6} />
                  </button>
                </div>
              ) : (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`flex flex-col items-center justify-center border-2 border-dashed bg-white px-5 py-8 transition-all duration-300 sm:py-10 ${isDragging ? 'border-bond-blue bg-bond-blue/5' : 'border-cashmere'}`}
                >
                  <UploadCloud
                    className={`mb-3 h-8 w-8 sm:h-10 sm:w-10 ${isDragging ? 'text-bond-blue' : 'text-gilded/30'}`}
                    strokeWidth={1.2}
                  />
                  <p className="mb-1 text-center text-sm font-medium text-midnight">
                    {isDragging
                      ? 'Drop image here'
                      : 'Add a photo of this gift'}
                  </p>
                  <p className="mb-4 hidden text-center text-xs text-gilded/50 sm:block">
                    Drag and drop, or use the buttons below
                  </p>
                  <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 border border-cashmere px-4 py-2 text-xs font-medium uppercase text-midnight transition-colors hover:border-midnight/30"
                      style={labelStyle}
                    >
                      <UploadCloud className="h-3.5 w-3.5" strokeWidth={1.8} />
                      Upload Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="flex items-center gap-2 bg-midnight px-4 py-2 text-xs font-medium uppercase text-white transition-all duration-300 hover:bg-midnight/90"
                      style={labelStyle}
                    >
                      <Camera className="h-3.5 w-3.5" strokeWidth={1.8} />
                      Take Photo
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-end gap-3 border-t border-cashmere bg-cream px-6 py-4 sm:gap-4 sm:px-8">
        <button
          type="button"
          onClick={() => {
            resetToGift()
            onCancel()
          }}
          className="px-3 py-2 text-xs font-medium uppercase text-gilded transition-colors duration-300 hover:text-midnight sm:px-4"
          style={labelStyle}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="bg-midnight px-5 py-2.5 text-xs font-medium uppercase text-white transition-all duration-300 hover:bg-midnight/90 hover:shadow-md sm:px-6"
          style={labelStyle}
        >
          Save Changes
        </button>
      </div>
    </div>
  )
}
