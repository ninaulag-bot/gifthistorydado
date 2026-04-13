import { Menu, Plus } from 'lucide-react'
interface HeaderProps {
  totalGifts: number
  totalPeople: number
  onAddGift?: () => void
  onToggleSidebar?: () => void
}
export function Header({
  totalGifts,
  totalPeople,
  onAddGift,
  onToggleSidebar,
}: HeaderProps) {
  return (
    <header className="w-full bg-cream border-b border-bond-blue/35 flex-shrink-0">
      <div className="flex items-end justify-between gap-4 px-5 pb-4 pt-6 sm:px-8 sm:pb-6 sm:pt-8">
        <div className="flex min-w-0 items-center gap-6 sm:gap-8">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="shrink-0 text-midnight/60 transition-colors duration-300 hover:text-midnight lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <div className="min-w-0">
            <h1 className="font-cormorant text-[28px] font-light not-italic leading-tight text-midnight sm:text-[30px]">
              My <span className="italic">Gift</span> History
            </h1>
            <p className="mt-1 font-sans text-sm font-light text-bond-blue">
              {totalGifts} gifts tracked · {totalPeople} relationships
            </p>
          </div>
        </div>
        {onAddGift ? (
          <button
            type="button"
            onClick={onAddGift}
            className="flex shrink-0 items-center gap-2 bg-midnight px-3 py-1.5 text-xs font-medium uppercase text-white transition-all duration-300 hover:bg-midnight/90 hover:shadow-md sm:px-4 sm:py-2"
            style={{ letterSpacing: '0.08em' }}
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
            <span>Add gift</span>
          </button>
        ) : null}
      </div>
    </header>
  )
}
