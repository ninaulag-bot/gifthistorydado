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
    <header className="w-full flex-shrink-0 border-b border-bond-blue/35 bg-cream">
      <div className="flex items-center justify-between gap-2 px-5 pb-4 pt-6 sm:gap-3 sm:px-8 sm:pb-6 sm:pt-8 lg:items-end lg:gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-4 sm:gap-5 lg:gap-8">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="shrink-0 text-midnight/60 transition-colors duration-300 hover:text-midnight lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-cormorant text-[22px] font-light not-italic leading-tight text-midnight sm:text-[26px] lg:text-[30px] lg:whitespace-normal">
              My <span className="italic">Gift</span> History
            </h1>
            <p className="mt-1 hidden font-sans text-sm font-light text-bond-blue lg:block">
              {totalGifts} gifts tracked · {totalPeople} relationships
            </p>
          </div>
        </div>
        {onAddGift ? (
          <button
            type="button"
            onClick={onAddGift}
            className="flex shrink-0 items-center gap-1 bg-midnight px-3 py-1.5 text-[9px] font-medium uppercase text-white transition-all duration-300 hover:bg-midnight/90 hover:shadow-md max-lg:leading-tight sm:gap-1.5 sm:px-4 sm:py-2 sm:text-[10px] lg:gap-2 lg:px-6 lg:py-2.5 lg:text-xs"
            style={{ letterSpacing: '0.08em' }}
          >
            <Plus
              className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5"
              strokeWidth={2}
              aria-hidden
            />
            <span>Add gift</span>
          </button>
        ) : null}
      </div>
    </header>
  )
}
