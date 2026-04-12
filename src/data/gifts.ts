import golfGlovesImg from '../assets/golf-gloves.png'
import gourmetCoffeeImg from '../assets/gourmet-coffee.png'
import artPrintImg from '../assets/art-print.png'
import handcraftedMugImg from '../assets/handcrafted-mug.png'
import peonyBouquetImg from '../assets/peony-bouquet.png'

export interface Pet {
  name: string
  type: string
  birthday?: string
}

export interface LifeEvent {
  type: string
  date: string
  description?: string
}

export interface PhoneEntry {
  number: string
  label?: string
}

export interface AddressEntry {
  street: string
  city: string
  state: string
  zip: string
  country?: string
  label?: string
}

export interface GiftPersonalNote {
  id: string
  body: string
  /** Short display date, e.g. "February 14" */
  date: string
}

export interface GiftItem {
  id: string
  name: string
  emoji: string
  direction: 'given' | 'received'
  person: {
    name: string
    initials: string
    relationship: string
    avatarColor: string
  }
  date: string
  occasion: string
  source: 'dado' | 'manual'
  notes?: string
  /** Timestamped journal entries on the gift detail page */
  personalNotes?: GiftPersonalNote[]
  imageUrl?: string
  imageFit?: 'contain' | 'cover'
  imageAreaBg?: string
}

export interface PersonData {
  name: string
  initials: string
  avatarColor: string
  relationship: string
  giftCount: number
  birthday?: string
  anniversary?: string
  pets?: Pet[]
  lifeEvents?: LifeEvent[]
  emails?: string[]
  phones?: PhoneEntry[]
  addresses?: AddressEntry[]
  notes?: string
}

export const people: PersonData[] = [
  {
    name: 'Mom',
    initials: 'M',
    avatarColor: 'bg-gradient-to-br from-bond-blue to-bond-blue/70',
    relationship: 'Mother',
    giftCount: 4,
    birthday: 'March 8',
    phones: [{ number: '+1 (312) 555-0198', label: 'Mobile' }],
    addresses: [
      {
        street: '45 Lakeshore Drive',
        city: 'Chicago',
        state: 'IL',
        zip: '60611',
        label: 'Home',
      },
    ],
    emails: ['margaret.j@email.com'],
    pets: [
      { name: 'Biscuit', type: 'Golden Retriever', birthday: 'April 2020' },
    ],
    notes: 'Loves peonies and French pastries. Allergic to shellfish.',
  },
  {
    name: 'Alex',
    initials: 'A',
    avatarColor: 'bg-gradient-to-br from-midnight to-midnight/70',
    relationship: 'Partner',
    giftCount: 1,
    birthday: 'June 3',
    anniversary: 'September 20, 2020',
    phones: [{ number: '+1 (608) 555-0142', label: 'Mobile' }],
    emails: ['alex.j@email.com'],
    notes: 'Coffee enthusiast. Favorite color is sage green.',
  },
  {
    name: 'Dad',
    initials: 'D',
    avatarColor: 'bg-gradient-to-br from-sage to-sage/70',
    relationship: 'Father',
    giftCount: 2,
    birthday: 'November 15',
    phones: [{ number: '+1 (312) 555-0199', label: 'Mobile' }],
    emails: ['robert.j@email.com'],
    notes: 'Golf enthusiast. Loves classic novels.',
  },
  {
    name: 'Sarah',
    initials: 'S',
    avatarColor: 'bg-gradient-to-br from-amber-warm to-amber-warm/70',
    relationship: 'Best Friend',
    giftCount: 5,
    birthday: 'August 22',
    emails: ['sarah.m@email.com'],
    notes: 'Art lover. Always up for brunch.',
  },
]

export const gifts: GiftItem[] = [
  {
    id: '1',
    name: 'Peony Bouquet',
    emoji: '🌸',
    direction: 'received',
    person: {
      name: 'Mom',
      initials: 'M',
      relationship: 'Mother',
      avatarColor: 'bg-gradient-to-br from-bond-blue to-bond-blue/70',
    },
    date: 'March 8',
    occasion: "Mother's Day",
    source: 'manual',
    notes: 'Beautiful pink peonies from the garden',
    imageUrl: peonyBouquetImg,
  },
  {
    id: '2',
    name: 'Handcrafted Mug',
    emoji: '☕',
    direction: 'given',
    person: {
      name: 'Alex',
      initials: 'A',
      relationship: 'Partner',
      avatarColor: 'bg-gradient-to-br from-midnight to-midnight/70',
    },
    date: 'June 3',
    occasion: 'Birthday',
    source: 'manual',
    notes: 'Ceramic mug from local artisan',
    imageUrl: handcraftedMugImg,
  },
  {
    id: '4',
    name: 'Gourmet Coffee Set',
    emoji: '☕',
    direction: 'given',
    person: {
      name: 'Sarah',
      initials: 'S',
      relationship: 'Best Friend',
      avatarColor: 'bg-gradient-to-br from-amber-warm to-amber-warm/70',
    },
    date: 'August 22',
    occasion: 'Birthday',
    source: 'manual',
    notes: 'Single-origin beans from Ethiopia',
    imageUrl: gourmetCoffeeImg,
  },
  {
    id: '5',
    name: 'Golf Gloves',
    emoji: '⛳',
    direction: 'given',
    person: {
      name: 'Dad',
      initials: 'D',
      relationship: 'Father',
      avatarColor: 'bg-gradient-to-br from-sage to-sage/70',
    },
    date: 'November 15',
    occasion: 'Birthday',
    source: 'manual',
    personalNotes: [
      {
        id: 'golf-n1',
        body: 'The most beautiful thing I have ever received. I have not taken it off since.',
        date: 'February 14',
      },
      {
        id: 'golf-n2',
        body: 'Wore it with the silk dress to dinner. Perfect weight — not too heavy, not too delicate.',
        date: 'February 15',
      },
    ],
    imageUrl: golfGlovesImg,
  },
  {
    id: '6',
    name: 'Art Print',
    emoji: '🖼️',
    direction: 'received',
    person: {
      name: 'Sarah',
      initials: 'S',
      relationship: 'Best Friend',
      avatarColor: 'bg-gradient-to-br from-amber-warm to-amber-warm/70',
    },
    date: 'August 22',
    occasion: 'Housewarming',
    source: 'manual',
    notes: 'Local artist, abstract landscape',
    imageUrl: artPrintImg,
  },
]
