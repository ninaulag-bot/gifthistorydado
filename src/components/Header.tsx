import { Menu } from 'lucide-react'
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
    <header className="w-full bg-cream border-b border-cashmere flex-shrink-0">
      <div className="flex items-end justify-between px-5 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6">
        <div className="flex items-center gap-8">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden text-midnight/60 hover:text-midnight transition-colors duration-300"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" strokeWidth={1.5} />
          </button>
          <div>
            <h1 className="font-cormorant text-[24px] font-normal leading-tight text-midnight">
              Gift History
            </h1>
            <p className="font-sans text-sm text-gilded mt-1">
              {totalGifts} gifts tracked · {totalPeople} relationships
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
