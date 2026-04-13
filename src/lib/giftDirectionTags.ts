/** Given / Received labels: Karla (`font-sans`), 400, uppercase; text #FAF9F4 (`text-cream`). */

const giftDirPillBase =
  'rounded-none px-3 py-1.5 font-sans text-[12px] font-normal uppercase tracking-[0.12em] text-cream antialiased'

export const giftDirPill10 = giftDirPillBase

export const giftDirPillGiven = `${giftDirPillBase} bg-[#6A7B8C]`
export const giftDirPillReceived = `${giftDirPillBase} bg-[#C7B8A5]`

export function giftDirPillClass(isGiven: boolean): string {
  return isGiven ? giftDirPillGiven : giftDirPillReceived
}

/** Header count rows (Given / Received + number). */
export function giftDirCountRowClass(kind: 'given' | 'received'): string {
  return `flex items-center gap-2 rounded-none px-3 py-1.5 font-sans text-[12px] font-normal uppercase tracking-[0.12em] text-cream antialiased ${
    kind === 'given' ? 'bg-[#6A7B8C]' : 'bg-[#C7B8A5]'
  }`
}

export const giftDirCountNumberClass =
  'font-sans text-sm font-normal tabular-nums text-cream'

/** Smaller count chips under the name on person profile (e.g. Mom · Mother). */
export function giftDirCountRowProfileClass(kind: 'given' | 'received'): string {
  return `flex items-center gap-1.5 rounded-none px-2.5 py-1 font-sans text-[11px] font-normal uppercase tracking-[0.12em] text-cream antialiased ${
    kind === 'given' ? 'bg-[#6A7B8C]' : 'bg-[#C7B8A5]'
  }`
}

export const giftDirCountNumberProfileClass =
  'font-sans text-xs font-normal tabular-nums text-cream'

/** Add-gift / detail edit: caps toggles. */
export const giftDirToggleBtnBase =
  'rounded-none font-sans text-[15px] font-normal uppercase px-3.5 py-2.5 border transition-all duration-300 outline-none'

export function giftDirToggleBtnClass(
  kind: 'given' | 'received',
  isActive: boolean,
): string {
  if (!isActive) {
    return `${giftDirToggleBtnBase} border-cashmere bg-white text-gilded hover:border-midnight/20 hover:text-midnight`
  }
  return `${giftDirToggleBtnBase} border-transparent ${
    kind === 'given'
      ? 'bg-[#6A7B8C] text-cream'
      : 'bg-[#C7B8A5] text-cream'
  }`
}

/** GiftEditForm: slightly larger padding. */
export const giftDirEditFormToggleBase =
  'rounded-none px-5 py-2.5 font-sans text-sm font-normal uppercase transition-all duration-300 sm:px-6'

export function giftDirEditFormToggleClass(
  kind: 'given' | 'received',
  isActive: boolean,
): string {
  if (!isActive) {
    return `${giftDirEditFormToggleBase} text-gilded hover:text-midnight`
  }
  return `${giftDirEditFormToggleBase} ${
    kind === 'given'
      ? 'bg-[#6A7B8C] text-cream shadow-sm'
      : 'bg-[#C7B8A5] text-cream shadow-sm'
  }`
}
