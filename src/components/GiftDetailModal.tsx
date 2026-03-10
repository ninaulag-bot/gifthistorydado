import React, { useState, useRef, useMemo, useEffect } from 'react'
import {
  X,
  Pencil,
  UploadCloud,
  Camera,
} from 'lucide-react'
import { GiftItem, PersonData } from '../data/gifts'
interface GiftDetailModalProps {
  isOpen: boolean
  onClose: () => void
  gift: GiftItem | null
  people?: PersonData[]
  onSave?: (updatedGift: GiftItem) => void
}
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
const labelStyle: React.CSSProperties = {
  letterSpacing: '0.14em',
}
const inputClass =
  'w-full bg-white border border-cashmere px-3 py-2 text-sm text-midnight placeholder:text-gilded/50 focus:border-bond-blue focus:outline-none transition-colors'
const sectionLabelClass = 'text-gilded text-[10px] font-medium uppercase'
const valueClass = 'text-midnight text-sm font-medium font-sans'
const hintClass = 'text-gilded/60 text-[11px] mt-1 italic'
export function GiftDetailModal({
  isOpen,
  onClose,
  gift,
  people = [],
  onSave,
}: GiftDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editDirection, setEditDirection] = useState<'given' | 'received'>(
    'given',
  )
  const [editOccasion, setEditOccasion] = useState('')
  const [editDate, setEditDate] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [editEmoji, setEditEmoji] = useState('')
  const [recipientQuery, setRecipientQuery] = useState('')
  const [selectedPerson, setSelectedPerson] = useState('')
  const [showRecipientDropdown, setShowRecipientDropdown] = useState(false)
  const [editPerson, setEditPerson] = useState<GiftItem['person'] | null>(null)
  const recipientInputRef = useRef<HTMLDivElement>(null)
  const [editImageUrl, setEditImageUrl] = useState('')
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
    if (!gift) return
    setEditName(gift.name)
    setEditDirection(gift.direction)
    setEditOccasion(gift.occasion)
    setEditDate(gift.date)
    setEditNotes(gift.notes || '')
    setEditEmoji(gift.emoji)
    setRecipientQuery(gift.person.name)
    setSelectedPerson(gift.person.name)
    setEditPerson(gift.person)
    setShowRecipientDropdown(false)
    setEditImageUrl(gift.imageUrl || '')
    setIsDragging(false)
  }
  useEffect(() => {
    if (gift && isOpen) {
      resetToGift()
      setIsEditing(false)
    }
  }, [gift, isOpen])
  if (!isOpen || !gift) return null
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsEditing(false)
      onClose()
    }
  }
  const handleClose = () => {
    setIsEditing(false)
    onClose()
  }
  const handleSave = () => {
    if (!gift) return
    const updated: GiftItem = {
      ...gift,
      name: editName,
      direction: editDirection,
      occasion: editOccasion,
      date: editDate,
      notes: editNotes || undefined,
      emoji: editEmoji,
      person: editPerson || gift.person,
      imageUrl: editImageUrl || undefined,
    }
    onSave?.(updated)
    setIsEditing(false)
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
  const isGiven = isEditing
    ? editDirection === 'given'
    : gift.direction === 'given'
  const directionLabel = isGiven ? 'Given' : 'Received'
  const directionColor = isGiven ? 'text-bond-blue' : 'text-amber-warm'
  const directionBg = isGiven ? 'bg-bond-blue/15' : 'bg-amber-warm/15'
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-midnight/40"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Gift Details"
    >
      <div className="bg-cream border border-cashmere w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] flex flex-col relative sm:rounded-none rounded-t-2xl">
        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gilded hover:text-midnight transition-colors duration-300 z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" strokeWidth={1.6} />
        </button>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {/* Hero Product Image — view mode only */}
          {!isEditing && gift.imageUrl && (
            <div className="w-full h-40 sm:h-56 bg-white border-b border-cashmere overflow-hidden">
              <img
                src={gift.imageUrl}
                alt={gift.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Header */}
          <div className="px-5 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6 border-b border-cashmere">
            <h2 className="font-cormorant font-normal text-[24px] text-midnight mb-1 pr-8">
              {isEditing ? 'Edit Gift' : gift.name}
            </h2>
            <p className="text-gilded text-sm">
              {isEditing ? (
                'Update gift details'
              ) : (
                <span className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`${directionBg} ${directionColor} px-2 py-0.5 text-[10px] font-medium uppercase`}
                    style={labelStyle}
                  >
                    {directionLabel}
                  </span>
                  {gift.source === 'dado' ? (
                    <span
                      className="text-bond-blue bg-bond-blue/10 px-2 py-0.5 text-[10px] font-medium uppercase"
                      style={labelStyle}
                    >
                      ✦ DADO
                    </span>
                  ) : (
                    <span
                      className="text-bond-blue bg-bond-blue/10 px-2 py-0.5 text-[10px] font-medium uppercase"
                      style={labelStyle}
                    >
                      ✎ Manual
                    </span>
                  )}
                </span>
              )}
            </p>
          </div>

          {/* Content */}
          <div className="px-5 sm:px-8 py-5 sm:py-6 space-y-6 sm:space-y-8">
            {isEditing ? (
              <>
                {/* ── EDIT: GIFT DETAILS ── */}
                <div>
                  <p className={sectionLabelClass} style={labelStyle}>
                    Gift Details
                  </p>
                  <div className="mt-3 sm:mt-4 space-y-4">
                    <div>
                      <label className={labelClass} style={labelStyle}>
                        Direction
                      </label>
                      <div className="flex items-center gap-1 bg-cashmere/30 p-1 w-fit">
                        <button
                          type="button"
                          onClick={() => setEditDirection('given')}
                          className={`px-4 sm:px-5 py-2 text-xs font-medium uppercase transition-all duration-300 ${editDirection === 'given' ? 'bg-midnight text-white shadow-sm' : 'text-gilded hover:text-midnight'}`}
                          style={labelStyle}
                        >
                          Given
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditDirection('received')}
                          className={`px-4 sm:px-5 py-2 text-xs font-medium uppercase transition-all duration-300 ${editDirection === 'received' ? 'bg-midnight text-white shadow-sm' : 'text-gilded hover:text-midnight'}`}
                          style={labelStyle}
                        >
                          Received
                        </button>
                      </div>
                    </div>

                    <div ref={recipientInputRef} className="relative">
                      <label className={labelClass} style={labelStyle}>
                        {editDirection === 'given'
                          ? 'Gift Recipient'
                          : 'Gift From'}{' '}
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
                          {people.find((p) => p.name === selectedPerson)
                            ?.relationship ||
                            editPerson?.relationship ||
                            'Connection'}
                        </p>
                      )}
                      {showRecipientDropdown &&
                        recipientQuery.trim() !== '' && (
                          <div className="absolute z-20 left-0 right-0 top-full mt-1 bg-white border border-cashmere shadow-lg max-h-48 overflow-y-auto">
                            {filteredPeople.map((p) => (
                              <button
                                key={p.name}
                                type="button"
                                onClick={() => handleSelectPerson(p)}
                                className="w-full text-left px-3 py-2.5 flex items-center gap-3 hover:bg-cream transition-colors duration-200"
                              >
                                <span
                                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${p.avatarColor}`}
                                >
                                  <span className="text-white text-[10px] font-semibold">
                                    {p.initials}
                                  </span>
                                </span>
                                <div className="min-w-0">
                                  <p className="text-midnight text-sm font-medium truncate">
                                    {p.name}
                                  </p>
                                  <p className="text-gilded text-xs">
                                    {p.relationship}
                                  </p>
                                </div>
                              </button>
                            ))}
                            {filteredPeople.length === 0 && (
                              <div className="px-3 py-3 text-gilded text-xs text-center">
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
                        <div className="flex items-center gap-4 bg-white border border-cashmere p-5">
                          <img
                            src={editImageUrl}
                            alt={editName}
                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-midnight text-sm font-medium truncate">
                              {editName}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setEditImageUrl('')}
                            className="text-gilded/50 hover:text-gilded transition-colors flex-shrink-0"
                          >
                            <X className="w-4 h-4" strokeWidth={1.6} />
                          </button>
                        </div>
                      ) : (
                        <div
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          className={`bg-white border-2 border-dashed flex flex-col items-center justify-center py-8 sm:py-10 px-5 transition-all duration-300 ${isDragging ? 'border-bond-blue bg-bond-blue/5' : 'border-cashmere'}`}
                        >
                          <UploadCloud
                            className={`w-8 sm:w-10 h-8 sm:h-10 mb-3 ${isDragging ? 'text-bond-blue' : 'text-gilded/30'}`}
                            strokeWidth={1.2}
                          />
                          <p className="text-midnight text-sm font-medium mb-1 text-center">
                            {isDragging
                              ? 'Drop image here'
                              : 'Add a photo of this gift'}
                          </p>
                          <p className="text-gilded/50 text-xs text-center mb-4 hidden sm:block">
                            Drag and drop, or use the buttons below
                          </p>
                          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="flex items-center gap-2 border border-cashmere px-4 py-2 text-xs font-medium uppercase text-midnight hover:border-midnight/30 transition-colors"
                              style={labelStyle}
                            >
                              <UploadCloud
                                className="w-3.5 h-3.5"
                                strokeWidth={1.8}
                              />
                              Upload Photo
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                cameraInputRef.current?.click()
                              }
                              className="flex items-center gap-2 bg-midnight text-white px-4 py-2 text-xs font-medium uppercase transition-all duration-300 hover:bg-midnight/90"
                              style={labelStyle}
                            >
                              <Camera
                                className="w-3.5 h-3.5"
                                strokeWidth={1.8}
                              />
                              Take Photo
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* ── VIEW: GIFT DETAILS ── */}
                <div>
                  <p className="text-gilded text-[13px] font-medium uppercase" style={labelStyle}>
                    Gift Details
                  </p>
                  <div className="mt-3 sm:mt-4 grid grid-cols-3 gap-4">
                    <div>
                      <label className={labelClass} style={labelStyle}>
                        Direction
                      </label>
                      <p className={valueClass}>
                        {directionLabel} {isGiven ? 'to' : 'from'}{' '}
                        {gift.person.name}
                      </p>
                    </div>
                    <div>
                      <label className={labelClass} style={labelStyle}>
                        {gift.direction === 'given'
                          ? 'Gift Recipient'
                          : 'Gift From'}
                      </label>
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${gift.person.avatarColor}`}
                        >
                          <span className="text-white text-xs font-semibold">
                            {gift.person.initials}
                          </span>
                        </span>
                        <div className="min-w-0">
                          <p className={valueClass}>{gift.person.name}</p>
                          <p className="text-gilded text-xs font-sans">
                            {gift.person.relationship}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className={labelClass} style={labelStyle}>
                        Occasion
                      </label>
                      <p className={valueClass}>{gift.occasion}</p>
                    </div>
                    <div>
                      <label className={labelClass} style={labelStyle}>
                        Date
                      </label>
                      <p className={valueClass}>{gift.date}</p>
                    </div>
                    <div>
                      <label className={labelClass} style={labelStyle}>
                        Source
                      </label>
                      <p className={valueClass}>
                        {gift.source === 'dado'
                          ? 'Dado (auto-tracked)'
                          : 'Manually added'}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-8 py-4 border-t border-cashmere flex items-center justify-end gap-3 sm:gap-4 flex-shrink-0 bg-cream">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={() => {
                  resetToGift()
                  setIsEditing(false)
                }}
                className="text-gilded hover:text-midnight text-xs font-medium uppercase transition-colors duration-300 px-3 sm:px-4 py-2"
                style={labelStyle}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="bg-midnight text-white px-5 sm:px-6 py-2.5 text-xs font-medium uppercase transition-all duration-300 hover:bg-midnight/90 hover:shadow-md"
                style={labelStyle}
              >
                Save Changes
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 text-gilded hover:text-midnight text-xs font-medium uppercase transition-colors duration-300 border border-cashmere px-3 py-1.5 hover:border-midnight/30"
                style={labelStyle}
              >
                <Pencil className="w-3.5 h-3.5" strokeWidth={1.6} />
                Edit Gift
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="text-gilded hover:text-midnight text-xs font-medium uppercase transition-colors duration-300 px-3 sm:px-4 py-2"
                style={labelStyle}
              >
                Close
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
