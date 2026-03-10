import React, { useEffect, useState, useRef } from 'react'
import { X, Plus, ChevronDown } from 'lucide-react'
import { PersonData } from '../data/gifts'
interface AddConnectionModalProps {
  isOpen: boolean
  onClose: () => void
  person?: PersonData | null
  onSave?: (data: PersonData) => void
}
interface EmailEntry {
  email: string
  type: string
}
interface PhoneEntry {
  number: string
  type: string
}
interface AddressEntry {
  street: string
  apt: string
  city: string
  state: string
  postal: string
  country: string
  type: string
}
const PRONOUNS = ['She/Her', 'He/Him', 'They/Them', 'Other']
const RELATIONSHIPS = [
  'Spouse/Partner',
  'Mother',
  'Father',
  'Sister',
  'Brother',
  'Daughter',
  'Son',
  'Extended Family',
  'Best Friend',
  'Close Friend',
  'Friend',
  'Colleague',
  'Boss',
  'Mentor',
  'Client',
  'Acquaintance',
  'Other',
]
const EMAIL_TYPES = ['Personal', 'Work', 'Other']
const PHONE_TYPES = ['Mobile', 'Home', 'Work', 'Other']
const ADDRESS_TYPES = ['Home', 'Work', 'Other']
const labelClass = 'text-gilded text-[12px] font-medium uppercase mb-1 block'
const labelStyle: React.CSSProperties = {
  letterSpacing: '0.14em',
}
const inputClass =
  'w-full bg-white border border-cashmere px-3 py-2 text-sm text-midnight placeholder:text-gilded/50 focus:border-bond-blue focus:outline-none transition-colors'
const sectionLabelClass = 'text-gilded text-[12px] font-medium uppercase'
const hintClass = 'text-gilded/60 text-[11px] mt-1 italic'
const addBtnClass =
  'border border-dashed border-cashmere hover:border-midnight/30 px-4 pt-2.5 pb-2.5 text-xs text-gilded hover:text-midnight text-center transition-all duration-300 inline-block'
const removeBtnClass =
  'text-red-400 text-xs hover:text-red-500 uppercase transition-colors'
export function AddConnectionModal({
  isOpen,
  onClose,
  person,
  onSave,
}: AddConnectionModalProps) {
  const isEditMode = !!person
  // 1. Personal Information
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [nickname, setNickname] = useState('')
  const [pronouns, setPronouns] = useState('')
  const [relationship, setRelationship] = useState('')
  const [pronounsOpen, setPronounsOpen] = useState(false)
  const [relationshipOpen, setRelationshipOpen] = useState(false)
  const [openEmailType, setOpenEmailType] = useState<number | null>(null)
  const [openPhoneType, setOpenPhoneType] = useState<number | null>(null)
  const [openAddressType, setOpenAddressType] = useState<number | null>(null)
  const pronounsRef = useRef<HTMLDivElement>(null)
  const relationshipRef = useRef<HTMLDivElement>(null)
  const emailTypeRefs = useRef<Map<number, HTMLDivElement>>(new Map())
  const phoneTypeRefs = useRef<Map<number, HTMLDivElement>>(new Map())
  const addressTypeRefs = useRef<Map<number, HTMLDivElement>>(new Map())
  const [company, setCompany] = useState('')
  // 2. Contact Information
  const [emails, setEmails] = useState<EmailEntry[]>([])
  const [phones, setPhones] = useState<PhoneEntry[]>([])
  const [addresses, setAddresses] = useState<AddressEntry[]>([])
  // 3. Birthday
  const [birthday, setBirthday] = useState('')
  // 4. Gift Preferences
  const [clothingSize, setClothingSize] = useState('')
  const [shoeSize, setShoeSize] = useState('')
  const [ringSize, setRingSize] = useState('')
  const [favoriteColors, setFavoriteColors] = useState('')
  const [stylePreferences, setStylePreferences] = useState('')
  const [favoriteBrands, setFavoriteBrands] = useState('')
  const [hobbies, setHobbies] = useState('')
  const [allergies, setAllergies] = useState('')
  const [additionalNotes, setAdditionalNotes] = useState('')
  const [giftIdeas, setGiftIdeas] = useState('')
  // Pre-populate fields in edit mode
  useEffect(() => {
    if (person) {
      const nameParts = person.name.split(' ')
      setFirstName(nameParts[0] || '')
      setLastName(nameParts.slice(1).join(' ') || '')
      setRelationship(person.relationship || '')
      setBirthday(person.birthday || '')
      setAdditionalNotes(person.notes || '')
      if (person.emails) {
        setEmails(
          person.emails.map((e) => ({
            email: e,
            type: 'Personal',
          })),
        )
      }
      if (person.phones) {
        setPhones(
          person.phones.map((p) => ({
            number: p.number,
            type: p.label || 'Mobile',
          })),
        )
      }
      if (person.addresses) {
        setAddresses(
          person.addresses.map((a) => ({
            street: a.street,
            apt: '',
            city: a.city,
            state: a.state,
            postal: a.zip,
            country: a.country || '',
            type: a.label || 'Home',
          })),
        )
      }
    } else {
      // Reset all fields for add mode
      setFirstName('')
      setLastName('')
      setNickname('')
      setPronouns('')
      setRelationship('')
      setCompany('')
      setEmails([])
      setPhones([])
      setAddresses([])
      setBirthday('')
      setClothingSize('')
      setShoeSize('')
      setRingSize('')
      setFavoriteColors('')
      setStylePreferences('')
      setFavoriteBrands('')
      setHobbies('')
      setAllergies('')
      setAdditionalNotes('')
      setGiftIdeas('')
    }
  }, [person])
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        pronounsRef.current &&
        !pronounsRef.current.contains(e.target as Node)
      ) {
        setPronounsOpen(false)
      }
      if (
        relationshipRef.current &&
        !relationshipRef.current.contains(e.target as Node)
      ) {
        setRelationshipOpen(false)
      }
      if (
        openEmailType !== null &&
        !emailTypeRefs.current.get(openEmailType)?.contains(e.target as Node)
      ) {
        setOpenEmailType(null)
      }
      if (
        openPhoneType !== null &&
        !phoneTypeRefs.current.get(openPhoneType)?.contains(e.target as Node)
      ) {
        setOpenPhoneType(null)
      }
      if (
        openAddressType !== null &&
        !addressTypeRefs.current.get(openAddressType)?.contains(e.target as Node)
      ) {
        setOpenAddressType(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openEmailType, openPhoneType, openAddressType])
  useEffect(() => {
    if (openEmailType !== null && openEmailType >= emails.length) {
      setOpenEmailType(null)
    }
    if (openPhoneType !== null && openPhoneType >= phones.length) {
      setOpenPhoneType(null)
    }
    if (openAddressType !== null && openAddressType >= addresses.length) {
      setOpenAddressType(null)
    }
  }, [emails.length, phones.length, addresses.length, openEmailType, openPhoneType, openAddressType])
  if (!isOpen) return null
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }
  // Email helpers
  const addEmail = () =>
    setEmails([
      ...emails,
      {
        email: '',
        type: 'Personal',
      },
    ])
  const removeEmail = (i: number) =>
    setEmails(emails.filter((_, idx) => idx !== i))
  const updateEmail = (i: number, field: keyof EmailEntry, value: string) => {
    const u = [...emails]
    u[i] = {
      ...u[i],
      [field]: value,
    }
    setEmails(u)
  }
  // Phone helpers
  const addPhone = () =>
    setPhones([
      ...phones,
      {
        number: '',
        type: 'Mobile',
      },
    ])
  const removePhone = (i: number) =>
    setPhones(phones.filter((_, idx) => idx !== i))
  const updatePhone = (i: number, field: keyof PhoneEntry, value: string) => {
    const u = [...phones]
    u[i] = {
      ...u[i],
      [field]: value,
    }
    setPhones(u)
  }
  // Address helpers
  const addAddress = () =>
    setAddresses([
      ...addresses,
      {
        street: '',
        apt: '',
        city: '',
        state: '',
        postal: '',
        country: '',
        type: 'Home',
      },
    ])
  const removeAddress = (i: number) =>
    setAddresses(addresses.filter((_, idx) => idx !== i))
  const updateAddress = (
    i: number,
    field: keyof AddressEntry,
    value: string,
  ) => {
    const u = [...addresses]
    u[i] = {
      ...u[i],
      [field]: value,
    }
    setAddresses(u)
  }
  const handleSave = () => {
    const name = `${firstName}${lastName ? ' ' + lastName : ''}`
    const initials = (firstName[0] || '') + (lastName[0] || '')
    const updatedPerson: PersonData = {
      name: name || person?.name || 'New Relationship',
      initials: initials.toUpperCase() || person?.initials || '?',
      avatarColor:
        person?.avatarColor ||
        'bg-gradient-to-br from-bond-blue to-bond-blue/70',
      relationship: relationship || person?.relationship || 'Friend',
      giftCount: person?.giftCount || 0,
      birthday: birthday || undefined,
      notes: additionalNotes || undefined,
      emails:
        emails.length > 0
          ? emails.map((e) => e.email).filter(Boolean)
          : undefined,
      phones:
        phones.length > 0
          ? phones
              .filter((p) => p.number)
              .map((p) => ({
                number: p.number,
                label: p.type,
              }))
          : undefined,
      addresses:
        addresses.length > 0
          ? addresses
              .filter((a) => a.street)
              .map((a) => ({
                street: a.street,
                city: a.city,
                state: a.state,
                zip: a.postal,
                country: a.country || undefined,
                label: a.type || undefined,
              }))
          : undefined,
    }
    onSave?.(updatedPerson)
    onClose()
  }
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-midnight/40"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Add a Relationship"
    >
      <div className="bg-[#faf9f4] border border-cashmere w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] flex flex-col relative sm:rounded-none rounded-t-2xl">
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
            {isEditMode ? `Edit ${person.name}` : 'New Relationship'}
          </h2>
          <p className="text-gilded text-sm">
            {isEditMode
              ? 'Update their details and preferences'
              : 'Add someone to your gifting circle'}
          </p>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-5 sm:py-6 space-y-6 sm:space-y-8">
          {/* ── 1. PERSONAL INFORMATION ── */}
          <div>
            <p className={sectionLabelClass} style={labelStyle}>
              Personal Information
            </p>
            <div className="mt-3 sm:mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} style={labelStyle}>
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass} style={labelStyle}>
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass} style={labelStyle}>
                  Preferred Name / Nickname
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="What they go by"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div ref={pronounsRef} className="relative">
                  <label className={labelClass} style={labelStyle}>
                    Pronouns
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setPronounsOpen(!pronounsOpen)
                        setRelationshipOpen(false)
                      }}
                      className={`${inputClass} w-full text-left pl-3 pr-10 min-h-[38px] flex items-center`}
                    >
                      <span className={pronouns ? 'text-midnight' : 'text-gilded/50'}>
                        {pronouns || 'Select…'}
                      </span>
                    </button>
                    <ChevronDown
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gilded pointer-events-none"
                      style={{ right: 12 }}
                      strokeWidth={1.6}
                    />
                  </div>
                  {pronounsOpen && (
                    <ul className="absolute z-20 left-0 right-0 top-full mt-1 bg-white border border-cashmere shadow-lg max-h-48 overflow-y-auto py-1">
                      <li>
                        <button
                          type="button"
                          onClick={() => {
                            setPronouns('')
                            setPronounsOpen(false)
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-gilded/70 hover:bg-cream hover:text-midnight transition-colors"
                        >
                          Select…
                        </button>
                      </li>
                      {PRONOUNS.map((p) => (
                        <li key={p}>
                          <button
                            type="button"
                            onClick={() => {
                              setPronouns(p)
                              setPronounsOpen(false)
                            }}
                            className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-cream ${
                              pronouns === p ? 'text-midnight font-medium bg-cream' : 'text-midnight'
                            }`}
                          >
                            {p}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div ref={relationshipRef} className="relative">
                  <label className={labelClass} style={labelStyle}>
                    Relationship *
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setRelationshipOpen(!relationshipOpen)
                        setPronounsOpen(false)
                      }}
                      className={`${inputClass} w-full text-left pl-3 pr-10 min-h-[38px] flex items-center`}
                    >
                      <span className={relationship ? 'text-midnight' : 'text-gilded/50'}>
                        {relationship || 'Select…'}
                      </span>
                    </button>
                    <ChevronDown
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gilded pointer-events-none"
                      style={{ right: 12 }}
                      strokeWidth={1.6}
                    />
                  </div>
                  {relationshipOpen && (
                    <ul className="absolute z-20 left-0 right-0 top-full mt-1 bg-white border border-cashmere shadow-lg max-h-48 overflow-y-auto py-1">
                      <li>
                        <button
                          type="button"
                          onClick={() => {
                            setRelationship('')
                            setRelationshipOpen(false)
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-gilded/70 hover:bg-cream hover:text-midnight transition-colors"
                        >
                          Select…
                        </button>
                      </li>
                      {RELATIONSHIPS.map((r) => (
                        <li key={r}>
                          <button
                            type="button"
                            onClick={() => {
                              setRelationship(r)
                              setRelationshipOpen(false)
                            }}
                            className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-cream ${
                              relationship === r ? 'text-midnight font-medium bg-cream' : 'text-midnight'
                            }`}
                          >
                            {r}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div>
                <label className={labelClass} style={labelStyle}>
                  Company / Organization
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Where they work"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* ── 2. CONTACT INFORMATION ── */}
          <div className="border-t border-cashmere pt-5 sm:pt-6">
            <p className={sectionLabelClass} style={labelStyle}>
              Contact Information
            </p>
            <div className="mt-3 sm:mt-4 space-y-6">
              {/* Emails */}
              <div>
                <label className={labelClass} style={labelStyle}>
                  Email Addresses
                </label>
                <div className="space-y-3 mt-2">
                  {emails.map((entry, i) => (
                    <div key={i} className="border-l-2 border-gilded/30 pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-midnight text-xs font-medium">
                          Email {i + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeEmail(i)}
                          className={removeBtnClass}
                          style={labelStyle}
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <input
                          type="email"
                          value={entry.email}
                          onChange={(e) =>
                            updateEmail(i, 'email', e.target.value)
                          }
                          placeholder="email@example.com"
                          className={`${inputClass} col-span-2`}
                        />
                        <div
                          ref={(el) => {
                            if (el) emailTypeRefs.current.set(i, el)
                          }}
                          className="relative col-span-1"
                        >
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => {
                                setOpenEmailType(openEmailType === i ? null : i)
                                setOpenPhoneType(null)
                                setOpenAddressType(null)
                              }}
                              className={`${inputClass} w-full text-left pl-3 pr-10 min-h-[38px] flex items-center`}
                            >
                              <span className="text-midnight">
                                {entry.type || 'Select…'}
                              </span>
                            </button>
                            <ChevronDown
                              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gilded pointer-events-none"
                              style={{ right: 12 }}
                              strokeWidth={1.6}
                            />
                          </div>
                          {openEmailType === i && (
                            <ul className="absolute z-20 left-0 right-0 top-full mt-1 bg-white border border-cashmere shadow-lg max-h-48 overflow-y-auto py-1">
                              {EMAIL_TYPES.map((t) => (
                                <li key={t}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      updateEmail(i, 'type', t)
                                      setOpenEmailType(null)
                                    }}
                                    className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-cream ${
                                      entry.type === t ? 'text-midnight font-medium bg-cream' : 'text-midnight'
                                    }`}
                                  >
                                    {t}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addEmail}
                  className={`${addBtnClass} mt-3`}
                >
                  + Add Email Address
                </button>
              </div>

              {/* Phones */}
              <div>
                <label className={labelClass} style={labelStyle}>
                  Phone Numbers
                </label>
                <div className="space-y-3 mt-2">
                  {phones.map((entry, i) => (
                    <div key={i} className="border-l-2 border-gilded/30 pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-midnight text-xs font-medium">
                          Phone {i + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removePhone(i)}
                          className={removeBtnClass}
                          style={labelStyle}
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <input
                          type="text"
                          value={entry.number}
                          onChange={(e) =>
                            updatePhone(i, 'number', e.target.value)
                          }
                          placeholder="+1 (555) 000-0000"
                          className={`${inputClass} col-span-2`}
                        />
                        <div
                          ref={(el) => {
                            if (el) phoneTypeRefs.current.set(i, el)
                          }}
                          className="relative col-span-1"
                        >
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => {
                                setOpenPhoneType(openPhoneType === i ? null : i)
                                setOpenEmailType(null)
                                setOpenAddressType(null)
                              }}
                              className={`${inputClass} w-full text-left pl-3 pr-10 min-h-[38px] flex items-center`}
                            >
                              <span className="text-midnight">
                                {entry.type || 'Select…'}
                              </span>
                            </button>
                            <ChevronDown
                              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gilded pointer-events-none"
                              style={{ right: 12 }}
                              strokeWidth={1.6}
                            />
                          </div>
                          {openPhoneType === i && (
                            <ul className="absolute z-20 left-0 right-0 top-full mt-1 bg-white border border-cashmere shadow-lg max-h-48 overflow-y-auto py-1">
                              {PHONE_TYPES.map((t) => (
                                <li key={t}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      updatePhone(i, 'type', t)
                                      setOpenPhoneType(null)
                                    }}
                                    className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-cream ${
                                      entry.type === t ? 'text-midnight font-medium bg-cream' : 'text-midnight'
                                    }`}
                                  >
                                    {t}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addPhone}
                  className={`${addBtnClass} mt-3`}
                >
                  + Add Phone Number
                </button>
              </div>

              {/* Addresses */}
              <div>
                <label className={labelClass} style={labelStyle}>
                  Addresses
                </label>
                <div className="space-y-4 mt-2">
                  {addresses.map((addr, i) => (
                    <div key={i} className="border-l-2 border-gilded/30 pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-midnight text-xs font-medium">
                          Address {i + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeAddress(i)}
                          className={removeBtnClass}
                          style={labelStyle}
                        >
                          Remove
                        </button>
                      </div>
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={addr.street}
                          onChange={(e) =>
                            updateAddress(i, 'street', e.target.value)
                          }
                          placeholder="Street address"
                          className={inputClass}
                        />
                        <input
                          type="text"
                          value={addr.apt}
                          onChange={(e) =>
                            updateAddress(i, 'apt', e.target.value)
                          }
                          placeholder="Apartment / Suite"
                          className={inputClass}
                        />
                        <div className="grid grid-cols-3 gap-3">
                          <input
                            type="text"
                            value={addr.city}
                            onChange={(e) =>
                              updateAddress(i, 'city', e.target.value)
                            }
                            placeholder="City"
                            className={inputClass}
                          />
                          <input
                            type="text"
                            value={addr.state}
                            onChange={(e) =>
                              updateAddress(i, 'state', e.target.value)
                            }
                            placeholder="State / Province"
                            className={inputClass}
                          />
                          <input
                            type="text"
                            value={addr.postal}
                            onChange={(e) =>
                              updateAddress(i, 'postal', e.target.value)
                            }
                            placeholder="Postal code"
                            className={inputClass}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={addr.country}
                            onChange={(e) =>
                              updateAddress(i, 'country', e.target.value)
                            }
                            placeholder="Country"
                            className={inputClass}
                          />
                          <div
                            ref={(el) => {
                              if (el) addressTypeRefs.current.set(i, el)
                            }}
                            className="relative col-span-1"
                          >
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenAddressType(openAddressType === i ? null : i)
                                  setOpenEmailType(null)
                                  setOpenPhoneType(null)
                                }}
                                className={`${inputClass} w-full text-left pl-3 pr-10 min-h-[38px] flex items-center`}
                              >
                                <span className="text-midnight">
                                  {addr.type || 'Select…'}
                                </span>
                              </button>
                              <ChevronDown
                                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gilded pointer-events-none"
                                style={{ right: 12 }}
                                strokeWidth={1.6}
                              />
                            </div>
                            {openAddressType === i && (
                              <ul className="absolute z-20 left-0 right-0 top-full mt-1 bg-white border border-cashmere shadow-lg max-h-48 overflow-y-auto py-1">
                                {ADDRESS_TYPES.map((t) => (
                                  <li key={t}>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        updateAddress(i, 'type', t)
                                        setOpenAddressType(null)
                                      }}
                                      className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-cream ${
                                        addr.type === t ? 'text-midnight font-medium bg-cream' : 'text-midnight'
                                      }`}
                                    >
                                      {t}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addAddress}
                  className={`${addBtnClass} mt-3`}
                >
                  + Add Address
                </button>
              </div>
            </div>
          </div>

          {/* ── 3. BIRTHDAY ── */}
          <div className="border-t border-cashmere pt-5 sm:pt-6">
            <p className={sectionLabelClass} style={labelStyle}>
              Birthday
            </p>
            <div className="mt-3 sm:mt-4">
              <input
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* ── 4. GIFT PREFERENCES & NOTES ── */}
          <div className="border-t border-cashmere pt-5 sm:pt-6">
            <p className={sectionLabelClass} style={labelStyle}>
              Gift Preferences & Notes
            </p>
            <div className="mt-3 sm:mt-4 space-y-4">
              <div>
                <label className={labelClass} style={labelStyle}>
                  Sizes
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={clothingSize}
                    onChange={(e) => setClothingSize(e.target.value)}
                    placeholder="Clothing size"
                    className={inputClass}
                  />
                  <input
                    type="text"
                    value={shoeSize}
                    onChange={(e) => setShoeSize(e.target.value)}
                    placeholder="Shoe size"
                    className={inputClass}
                  />
                  <input
                    type="text"
                    value={ringSize}
                    onChange={(e) => setRingSize(e.target.value)}
                    placeholder="Ring size"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass} style={labelStyle}>
                  Favorite Colors
                </label>
                <input
                  type="text"
                  value={favoriteColors}
                  onChange={(e) => setFavoriteColors(e.target.value)}
                  placeholder="e.g. Navy, gold, blush"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass} style={labelStyle}>
                  Style Preferences
                </label>
                <input
                  type="text"
                  value={stylePreferences}
                  onChange={(e) => setStylePreferences(e.target.value)}
                  placeholder="e.g. Minimalist, classic, bohemian"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass} style={labelStyle}>
                  Favorite Brands
                </label>
                <input
                  type="text"
                  value={favoriteBrands}
                  onChange={(e) => setFavoriteBrands(e.target.value)}
                  placeholder="Brands they love"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass} style={labelStyle}>
                  Hobbies & Interests
                </label>
                <textarea
                  value={hobbies}
                  onChange={(e) => setHobbies(e.target.value)}
                  placeholder="What they enjoy doing…"
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div>
                <label className={labelClass} style={labelStyle}>
                  Allergies / Dietary Restrictions
                </label>
                <textarea
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="Important for food gifts, perfumes, etc."
                  rows={2}
                  className={`${inputClass} resize-none`}
                />
                <p className={hintClass}>
                  Important for food gifts, perfumes, etc.
                </p>
              </div>

              <div>
                <label className={labelClass} style={labelStyle}>
                  Additional Notes
                </label>
                <textarea
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Anything else worth remembering…"
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div>
                <label className={labelClass} style={labelStyle}>
                  Gift Ideas
                </label>
                <textarea
                  value={giftIdeas}
                  onChange={(e) => setGiftIdeas(e.target.value)}
                  placeholder="Things they've mentioned wanting…"
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
                <p className={hintClass}>
                  Things they've mentioned wanting or that would be perfect for
                  them
                </p>
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
            onClick={handleSave}
            className="bg-midnight text-white px-5 sm:px-6 py-2.5 text-xs font-medium uppercase transition-all duration-300 hover:bg-midnight/90 hover:shadow-md"
            style={labelStyle}
          >
            {isEditMode ? 'Save Changes' : 'Save Relationship'}
          </button>
        </div>
      </div>
    </div>
  )
}
