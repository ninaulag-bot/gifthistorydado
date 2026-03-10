import { useState, useMemo, useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { GiftItem } from '../data/gifts'
interface TimelineProps {
  gifts: GiftItem[]
  onGiftClick?: (gift: GiftItem) => void
}
interface GroupedGifts {
  year: string
  items: GiftItem[]
}
const MONTHS = [
  'All Months',
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
function parseDate(dateStr: string): Date {
  return new Date(dateStr)
}
function groupByYear(gifts: GiftItem[]): GroupedGifts[] {
  const sorted = [...gifts].sort(
    (a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime(),
  )
  const groups: Record<string, GiftItem[]> = {}
  sorted.forEach((gift) => {
    const year = parseDate(gift.date).getFullYear().toString()
    if (!groups[year]) groups[year] = []
    groups[year].push(gift)
  })
  return Object.entries(groups)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, items]) => ({
      year,
      items,
    }))
}
const inputClass =
  'w-full bg-white border border-cashmere px-3 py-2 text-sm text-midnight placeholder:text-gilded/50 focus:border-bond-blue focus:outline-none transition-colors'
export function Timeline({ gifts, onGiftClick }: TimelineProps) {
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [selectedMonth, setSelectedMonth] = useState<number>(0)
  const [yearOpen, setYearOpen] = useState(false)
  const [monthOpen, setMonthOpen] = useState(false)
  const yearRef = useRef<HTMLDivElement>(null)
  const monthRef = useRef<HTMLDivElement>(null)
  const availableYears = useMemo(() => {
    const years = new Set(
      gifts.map((g) => parseDate(g.date).getFullYear().toString()),
    )
    return ['all', ...Array.from(years).sort((a, b) => Number(b) - Number(a))]
  }, [gifts])
  const filteredGifts = useMemo(() => {
    let result = [...gifts]
    if (selectedYear !== 'all') {
      result = result.filter(
        (g) => parseDate(g.date).getFullYear().toString() === selectedYear,
      )
    }
    if (selectedMonth > 0) {
      result = result.filter(
        (g) => parseDate(g.date).getMonth() === selectedMonth - 1,
      )
    }
    return result
  }, [gifts, selectedYear, selectedMonth])
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (yearRef.current && !yearRef.current.contains(e.target as Node)) {
        setYearOpen(false)
      }
      if (monthRef.current && !monthRef.current.contains(e.target as Node)) {
        setMonthOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  const grouped = groupByYear(filteredGifts)
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
        <h2 className="font-cormorant font-normal text-[24px] text-midnight">
          Timeline
        </h2>

        <div className="flex items-center gap-2 sm:gap-3">
          <div ref={yearRef} className="relative min-w-[120px]">
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setYearOpen(!yearOpen)
                  setMonthOpen(false)
                }}
                className={`${inputClass} w-full text-left pl-3 pr-10 min-h-[38px] flex items-center`}
              >
                <span className="text-midnight">
                  {selectedYear === 'all' ? 'All Years' : selectedYear}
                </span>
              </button>
              <ChevronDown
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gilded pointer-events-none"
                style={{ right: 12 }}
                strokeWidth={1.6}
              />
            </div>
            {yearOpen && (
              <ul className="absolute z-20 left-0 right-0 top-full mt-1 bg-white border border-cashmere shadow-lg max-h-48 overflow-y-auto py-1">
                {availableYears.map((year) => (
                  <li key={year}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedYear(year)
                        setYearOpen(false)
                      }}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-cream ${
                        selectedYear === year ? 'text-midnight font-medium bg-cream' : 'text-midnight'
                      }`}
                    >
                      {year === 'all' ? 'All Years' : year}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div ref={monthRef} className="relative min-w-[140px]">
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setMonthOpen(!monthOpen)
                  setYearOpen(false)
                }}
                className={`${inputClass} w-full text-left pl-3 pr-10 min-h-[38px] flex items-center`}
              >
                <span className="text-midnight">
                  {MONTHS[selectedMonth]}
                </span>
              </button>
              <ChevronDown
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gilded pointer-events-none"
                style={{ right: 12 }}
                strokeWidth={1.6}
              />
            </div>
            {monthOpen && (
              <ul className="absolute z-20 left-0 right-0 top-full mt-1 bg-white border border-cashmere shadow-lg max-h-48 overflow-y-auto py-1">
                {MONTHS.map((month, i) => (
                  <li key={month}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMonth(i)
                        setMonthOpen(false)
                      }}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-cream ${
                        selectedMonth === i ? 'text-midnight font-medium bg-cream' : 'text-midnight'
                      }`}
                    >
                      {month}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {grouped.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
          <p className="font-cormorant font-normal text-[24px] text-midnight/40 mb-2">
            No gifts found
          </p>
          <p className="text-gilded text-sm">
            Try adjusting your year or month filter.
          </p>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8">
          <div className="absolute left-[9px] sm:left-[11px] top-2 bottom-0 w-[2px] bg-gradient-to-b from-bond-blue to-bond-blue/20" />

          {grouped.map((group) => (
            <div key={group.year} className="mb-6 sm:mb-8">
              <div className="relative flex items-center mb-4 sm:mb-5">
                <span className="absolute left-[-21px] sm:left-[-25px] w-[10px] h-[10px] rounded-full bg-bond-blue border-2 border-cream" />
                <h3 className="font-cormorant font-normal text-xl text-midnight">
                  {group.year}
                </h3>
              </div>

              <div className="space-y-3">
                {group.items.map((gift) => {
                  const isGiven = gift.direction === 'given'
                  const dotColor = isGiven ? 'bg-bond-blue' : 'bg-amber-warm'
                  const badgeColor = isGiven
                    ? 'text-bond-blue bg-bond-blue/10'
                    : 'text-amber-warm bg-amber-warm/10'
                  return (
                    <div key={gift.id} className="relative">
                      <span
                        className={`absolute left-[-19px] sm:left-[-23px] top-5 w-[6px] h-[6px] rounded-full ${dotColor}`}
                      />

                      <div
                        onClick={() => onGiftClick?.(gift)}
                        className="bg-white border border-bond-blue rounded-card p-5 transition-all duration-300 hover:border-bond-blue/40 hover:shadow-[0_2px_12px_rgba(140,169,196,0.15)] hover:-translate-y-px cursor-pointer"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3 mb-1.5">
                          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                            {gift.imageUrl ? (
                              <img
                                src={gift.imageUrl}
                                alt={gift.name}
                                className="w-7 h-7 sm:w-8 sm:h-8 rounded object-cover flex-shrink-0"
                              />
                            ) : (
                              <span className="text-lg sm:text-xl flex-shrink-0">
                                {gift.emoji}
                              </span>
                            )}
                            <span className="font-cormorant font-normal text-lg text-midnight truncate">
                              {gift.name}
                            </span>
                            <span
                              className={`flex-shrink-0 px-2 py-0.5 text-[9px] font-medium uppercase ${badgeColor}`}
                              style={{
                                letterSpacing: '0.1em',
                              }}
                            >
                              {gift.direction}
                            </span>
                          </div>
                          <span className="text-gilded text-xs sm:text-sm flex-shrink-0 whitespace-nowrap font-sans">
                            {gift.date}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gilded font-sans">
                          <span className="font-medium text-midnight/60">
                            {gift.person.name}
                          </span>
                          <span>·</span>
                          <span>{gift.occasion}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
