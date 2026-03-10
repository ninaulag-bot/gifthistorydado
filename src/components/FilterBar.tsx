import { Search, Plus } from 'lucide-react'
type FilterType = 'all' | 'received' | 'given'
interface FilterBarProps {
  activeFilter: FilterType
  onFilterChange: (filter: FilterType) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  onAddGift?: () => void
}
const filters: {
  id: FilterType
  label: string
}[] = [
  {
    id: 'all',
    label: 'All',
  },
  {
    id: 'received',
    label: 'Received',
  },
  {
    id: 'given',
    label: 'Given',
  },
]
export function FilterBar({
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  onAddGift,
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-flex-start sm:justify-between gap-4 mb-6 sm:mb-8">
      {/* Left: Filter */}
      <div
        role="group"
        aria-label="Filter gifts"
        className="inline-flex p-1 border border-[#D8CEC1] bg-[#FAF9F4] w-fit"
      >
        {filters.map((filter) => {
          const isActive = activeFilter === filter.id
          return (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`font-sans text-[14px] font-light uppercase px-8 py-2 transition-all duration-300 outline-none hover:opacity-80 ${isActive ? '' : 'bg-white'}`}
              style={isActive ? { backgroundColor: '#1A2530', color: '#FAF9F4', letterSpacing: '2px' } : { color: '#A89885', letterSpacing: '2px' }}
              aria-pressed={isActive}
            >
              {filter.label}
            </button>
          )
        })}
      </div>

      {/* Right: Search + Add a Gift - close together, slightly bigger */}
      <div className="flex items-center gap-2 self-start">
        <div className="relative w-36 sm:w-40 flex-shrink-0">
          <Search
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gilded"
            strokeWidth={1.6}
          />
          <input
            type="text"
            placeholder="Search gifts..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="font-sans border-[0.5px] border-[#D8CEC1] pl-8 pr-3 py-1.5 text-[13px] text-midnight bg-white placeholder:text-gilded/60 focus:outline-none focus:border-bond-blue focus:ring-1 focus:ring-bond-blue/30 transition-all duration-300 w-full"
            aria-label="Search gifts"
          />
        </div>
        {onAddGift && (
          <button
            onClick={onAddGift}
            className="flex items-center justify-center gap-1.5 bg-[#8CA9C4] hover:bg-[#8CA9C4]/90 text-white px-4 py-1.5 font-sans text-[13px] font-light uppercase transition-all duration-300 flex-shrink-0"
            style={{ letterSpacing: '1px' }}
            style={{ letterSpacing: '1px' }}
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            <span className="hidden sm:inline">Add a Gift</span>
            <span className="sm:hidden">Add</span>
          </button>
        )}
      </div>
    </div>
  )
}
