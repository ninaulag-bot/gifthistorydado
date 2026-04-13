import { useState, useRef, useEffect, useMemo } from 'react'
import { giftDirToggleBtnClass } from '../lib/giftDirectionTags'
import {
  X,
  Link,
  Loader2,
  Plus,
  UserPlus,
  Camera,
  UploadCloud,
  Image,
} from 'lucide-react'
import { PersonData } from '../data/gifts'
interface AddGiftModalProps {
  isOpen: boolean
  onClose: () => void
  people: PersonData[]
  onAddPerson?: (person: PersonData) => void
  preselectedPerson?: string | null
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
  'Other',
]
const RETAILERS = [
  'Amazon',
  'Etsy',
  'Target',
  'Nordstrom',
  'Sephora',
  'Hermès',
  'Apple',
  'Williams Sonoma',
  'Anthropologie',
  'Crate & Barrel',
  'Pottery Barn',
  'West Elm',
  'REI',
  'Lululemon',
  'Nordstrom Rack',
  'TJ Maxx',
  'Costco',
  "Trader Joe's",
  'Whole Foods',
  'Local artisan',
  'Small business',
]
const labelClass = 'text-gilded text-[12px] font-medium uppercase mb-1 block'
const labelStyle: React.CSSProperties = {
  letterSpacing: '0.14em',
}
const inputClass =
  'w-full bg-white border border-cashmere px-3 py-2 text-sm text-midnight placeholder:text-gilded/50 focus:border-bond-blue focus:outline-none transition-colors'
const sectionLabelClass = 'text-gilded text-[12px] font-medium uppercase'
const hintClass = 'text-gilded/60 text-[11px] mt-1 italic'
export function AddGiftModal({
  isOpen,
  onClose,
  people,
  onAddPerson,
  preselectedPerson,
}: AddGiftModalProps) {
  const [productLink, setProductLink] = useState('')
  const [isLinkLoading, setIsLinkLoading] = useState(false)
  const [linkFetched, setLinkFetched] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [giftName, setGiftName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const [direction, setDirection] = useState<'given' | 'received'>('given')
  const [selectedPerson, setSelectedPerson] = useState('')
  const [recipientQuery, setRecipientQuery] = useState('')
  const [showRecipientDropdown, setShowRecipientDropdown] = useState(false)
  const [occasion, setOccasion] = useState('')
  const [date, setDate] = useState('')
  const [retailer, setRetailer] = useState('')
  const [showRetailerDropdown, setShowRetailerDropdown] = useState(false)
  const recipientInputRef = useRef<HTMLDivElement>(null)
  const retailerInputRef = useRef<HTMLDivElement>(null)
  const [hasInitialized, setHasInitialized] = useState(false)
  const [showPhotoSheet, setShowPhotoSheet] = useState(false)
  useEffect(() => {
    if (isOpen && preselectedPerson && !hasInitialized) {
      setSelectedPerson(preselectedPerson)
      setRecipientQuery(preselectedPerson)
      setShowRecipientDropdown(false)
      setHasInitialized(true)
    }
    if (!isOpen) {
      setHasInitialized(false)
    }
  }, [isOpen, preselectedPerson, hasInitialized])
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        retailerInputRef.current &&
        !retailerInputRef.current.contains(e.target as Node)
      ) {
        setShowRetailerDropdown(false)
      }
    }
    if (showRetailerDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showRetailerDropdown])
  const filteredPeople = useMemo(() => {
    if (!recipientQuery.trim()) return people
    const q = recipientQuery.toLowerCase()
    return people.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.relationship.toLowerCase().includes(q),
    )
  }, [recipientQuery, people])
  const isNewPerson =
    recipientQuery.trim() !== '' &&
    !people.some(
      (p) => p.name.toLowerCase() === recipientQuery.trim().toLowerCase(),
    )
  const filteredRetailers = useMemo(() => {
    if (!retailer.trim()) return RETAILERS
    const q = retailer.toLowerCase()
    return RETAILERS.filter((r) => r.toLowerCase().includes(q))
  }, [retailer])
  const handleSelectPerson = (name: string) => {
    setSelectedPerson(name)
    setRecipientQuery(name)
    setShowRecipientDropdown(false)
  }
  const handleAddNewPerson = () => {
    const name = recipientQuery.trim()
    if (!name) return
    const initials = name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
    const colors = [
      'bg-gradient-to-br from-bond-blue to-bond-blue/70',
      'bg-gradient-to-br from-midnight to-midnight/70',
      'bg-gradient-to-br from-gilded to-gilded/70',
      'bg-gradient-to-br from-amber-warm to-amber-warm/70',
      'bg-gradient-to-br from-sage to-sage/70',
    ]
    const color = colors[Math.floor(Math.random() * colors.length)]
    const newPerson: PersonData = {
      name,
      initials,
      avatarColor: color,
      relationship: 'Friend',
      giftCount: 0,
    }
    onAddPerson?.(newPerson)
    setSelectedPerson(name)
    setShowRecipientDropdown(false)
  }
  if (!isOpen) return null
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }
  const handleFetchLink = () => {
    if (!productLink.trim()) return
    setIsLinkLoading(true)
    setTimeout(() => {
      setGiftName('Silk Scarf — Hermès')
      setImageUrl(
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200&h=200&fit=crop',
      )
      setRetailer('Hermès')
      setIsLinkLoading(false)
      setLinkFetched(true)
    }, 1200)
  }
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      setImageUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-midnight/40"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Add a Gift"
    >
      <div className="bg-[#faf9f4] border border-cashmere w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] flex flex-col relative sm:rounded-none rounded-t-2xl">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gilded hover:text-midnight transition-colors duration-300 z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" strokeWidth={1.6} />
        </button>

        {/* Header */}
        <div className="px-5 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6 border-b border-cashmere flex-shrink-0">
          <h2 className="font-cormorant font-normal not-italic text-[24px] text-midnight mb-1 pr-8">
            {preselectedPerson
              ? `Add a Gift for ${preselectedPerson}`
              : 'Add a Gift'}
          </h2>
          <p className="text-gilded text-sm">Record a gift given or received</p>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-5 sm:py-6 space-y-6 sm:space-y-8">
          {/* ── GIFT DETAILS ── */}
          <div>
            <p className={sectionLabelClass} style={labelStyle}>
              Gift Details
            </p>
            <div className="mt-3 sm:mt-4 space-y-4">
              {/* Direction choice */}
              <div className="space-y-2">
                <p className="font-sans text-[11px] font-medium normal-case text-gilded mb-1">
                  Given or received?
                </p>
                <div className="flex flex-wrap gap-2">
                  {(['given', 'received'] as const).map((d) => {
                    const isActive = direction === d
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDirection(d)}
                        className={giftDirToggleBtnClass(d, isActive)}
                        style={{ letterSpacing: '0.14em' }}
                      >
                        {d === 'given' ? 'GIVEN' : 'RECEIVED'}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Gift Recipient / Gift From */}
              <div ref={recipientInputRef} className="relative">
                <label className={labelClass} style={labelStyle}>
                  {direction === 'given' ? 'Gift Recipient' : 'Gift From'}{' '}
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
                      ?.relationship || 'New relationship'}
                  </p>
                )}

                {showRecipientDropdown && recipientQuery.trim() !== '' && (
                  <div className="absolute z-20 left-0 right-0 top-full mt-1 bg-white border border-cashmere shadow-lg max-h-48 overflow-y-auto">
                    {filteredPeople.map((p) => (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => handleSelectPerson(p.name)}
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

                    {isNewPerson && (
                      <button
                        type="button"
                        onClick={handleAddNewPerson}
                        className="w-full text-left px-3 py-2.5 flex items-center gap-3 hover:bg-cream transition-colors duration-200 border-t border-cashmere"
                      >
                        <span className="w-7 h-7 rounded-full bg-bond-blue/10 flex items-center justify-center flex-shrink-0">
                          <UserPlus
                            className="w-3.5 h-3.5 text-bond-blue"
                            strokeWidth={2}
                          />
                        </span>
                        <div className="min-w-0">
                          <p className="text-bond-blue text-sm font-medium">
                            Add "{recipientQuery.trim()}" as new relationship
                          </p>
                        </div>
                      </button>
                    )}

                    {filteredPeople.length === 0 && !isNewPerson && (
                      <div className="px-3 py-3 text-gilded text-xs text-center">
                        No matches found
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Occasion */}
              <div>
                <label className={labelClass} style={labelStyle}>
                  Occasion
                </label>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select an occasion…</option>
                  {OCCASIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date + Retailer row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} style={labelStyle}>
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div ref={retailerInputRef} className="relative">
                  <label className={labelClass} style={labelStyle}>
                    Brand | Retailer
                  </label>
                  <input
                    type="text"
                    value={retailer}
                    onChange={(e) => {
                      setRetailer(e.target.value)
                      setShowRetailerDropdown(true)
                    }}
                    onFocus={() => setShowRetailerDropdown(true)}
                    placeholder="Start typing to search…"
                    className={inputClass}
                  />
                  {showRetailerDropdown && (
                    <div className="absolute z-20 left-0 right-0 top-full mt-1 bg-white border border-cashmere shadow-lg max-h-48 overflow-y-auto">
                      {filteredRetailers.map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => {
                            setRetailer(r)
                            setShowRetailerDropdown(false)
                          }}
                          className="w-full text-left px-3 py-2.5 hover:bg-cream transition-colors duration-200 text-sm text-midnight"
                        >
                          {r}
                        </button>
                      ))}
                      {filteredRetailers.length === 0 && (
                        <div className="px-3 py-3 text-gilded text-xs text-center">
                          No matches — type to add custom
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── PRODUCT DETAILS ── */}
          <div className="border-t border-cashmere pt-5 sm:pt-6">
            <p className={sectionLabelClass} style={labelStyle}>
              Product Details
            </p>
            <div className="mt-3 sm:mt-4 space-y-4">
                    <div>
                      <label className={labelClass} style={labelStyle}>
                        Product URL
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <input
                          type="url"
                          value={productLink}
                          onChange={(e) => {
                            setProductLink(e.target.value)
                            setLinkFetched(false)
                          }}
                          placeholder="https://www.hermes.com/us/en/product/..."
                          className={`${inputClass} flex-1`}
                        />
                        <button
                          type="button"
                          onClick={handleFetchLink}
                          disabled={isLinkLoading || !productLink.trim()}
                          className="bg-bond-blue text-white px-4 py-2 text-xs font-medium uppercase transition-all duration-300 hover:bg-bond-blue/90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 flex-shrink-0"
                          style={labelStyle}
                        >
                          {isLinkLoading ? (
                            <Loader2
                              className="w-3.5 h-3.5 animate-spin"
                              strokeWidth={2}
                            />
                          ) : (
                            'Fetch'
                          )}
                        </button>
                      </div>
                      <p className={hintClass}>
                        Paste a product link to auto-fill the gift name and
                        image
                      </p>
                    </div>

                    <div className="mt-4">
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
                        value={giftName}
                        onChange={(e) => setGiftName(e.target.value)}
                        placeholder="e.g. Candle, silk scarf"
                        className={inputClass}
                      />
                      {linkFetched && (
                        <p className={hintClass}>
                          Auto-filled from link — feel free to edit
                        </p>
                      )}
                    </div>

                    <div className="mt-4">
                      <label className={labelClass} style={labelStyle}>
                        Gift Image
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

                      {imageUrl ? (
                        <div className="flex items-center gap-4 bg-white border border-cashmere p-5">
                          <img
                            src={imageUrl}
                            alt="Gift preview"
                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-midnight text-sm font-medium">
                              {linkFetched
                                ? 'Auto-filled from link'
                                : 'Your photo'}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-1.5">
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="text-bond-blue text-xs hover:text-bond-blue/80 transition-colors"
                              >
                                Replace with photo
                              </button>
                              <span className="text-gilded/30 text-xs">·</span>
                              <button
                                type="button"
                                onClick={() => setImageUrl('')}
                                className="text-gilded text-xs hover:text-midnight transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="bg-white border-2 border-dashed border-cashmere py-8 sm:py-10 px-5 flex flex-col items-center justify-center text-center">
                            <UploadCloud
                              className="w-8 h-8 sm:w-10 sm:h-10 mb-3 text-gilded/30"
                              strokeWidth={1.2}
                            />
                            <p className="text-midnight text-sm font-medium mb-1">
                              {productLink.trim()
                                ? 'Image will auto-fill when you fetch the link'
                                : 'Paste a link above to auto-fill'}
                            </p>
                            <p className="text-midnight text-sm font-medium">
                              or add your own photo
                            </p>
                          </div>
                          {/* Mobile: single Add Photo button */}
                          <div className="sm:hidden mt-3">
                            <button
                              type="button"
                              onClick={() => setShowPhotoSheet(true)}
                              className="flex items-center gap-2 bg-midnight text-white px-4 py-2 text-xs font-medium uppercase transition-all duration-300 hover:bg-midnight/90 w-full justify-center"
                              style={labelStyle}
                            >
                              <Camera
                                className="w-3.5 h-3.5"
                                strokeWidth={1.8}
                              />
                              Add Photo
                            </button>
                          </div>
                          {/* Desktop: Upload Photo button only */}
                          <div className="hidden sm:flex items-center gap-3 mt-3">
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
                          </div>
                        </>
                      )}
                    </div>
            </div>
          </div>
        </div>

        {/* Sticky footer */}
        <div className="px-5 sm:px-8 py-4 border-t border-cashmere flex items-center justify-end gap-3 sm:gap-4 flex-shrink-0 bg-[#faf9f4]">
          <button
            type="button"
            onClick={onClose}
            className="text-gilded hover:text-midnight text-xs font-medium uppercase transition-colors duration-300 px-3 sm:px-4 py-2"
            style={labelStyle}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-midnight text-white px-5 sm:px-6 py-2.5 text-xs font-medium uppercase transition-all duration-300 hover:bg-midnight/90 hover:shadow-md"
            style={labelStyle}
          >
            Add Gift
          </button>
        </div>
      </div>

      {/* iOS-style photo action sheet (mobile only) */}
      {showPhotoSheet && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 sm:hidden"
          onClick={() => setShowPhotoSheet(false)}
        >
          <div
            className="w-full max-w-lg px-3 pb-3 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Options group */}
            <div className="bg-white rounded-2xl overflow-hidden">
              <button
                type="button"
                onClick={() => {
                  setShowPhotoSheet(false)
                  setTimeout(() => fileInputRef.current?.click(), 100)
                }}
                className="w-full py-4 text-center text-bond-blue text-[17px] font-normal border-b border-cashmere/50 active:bg-gray-50 transition-colors"
              >
                <span className="flex items-center justify-center gap-2.5">
                  <Image className="w-5 h-5" strokeWidth={1.6} />
                  Photo Library
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPhotoSheet(false)
                  setTimeout(() => cameraInputRef.current?.click(), 100)
                }}
                className="w-full py-4 text-center text-bond-blue text-[17px] font-normal active:bg-gray-50 transition-colors"
              >
                <span className="flex items-center justify-center gap-2.5">
                  <Camera className="w-5 h-5" strokeWidth={1.6} />
                  Camera
                </span>
              </button>
            </div>
            {/* Cancel button */}
            <button
              type="button"
              onClick={() => setShowPhotoSheet(false)}
              className="w-full mt-2 py-4 text-center bg-white rounded-2xl text-bond-blue text-[17px] font-semibold active:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
