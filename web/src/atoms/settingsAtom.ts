import { atomWithStorage } from 'jotai/utils'

// Check if browser prefer dark theme
const isPreferDark = (): boolean => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return true
  }
  return false
}

export const themeAtom = atomWithStorage('darkTheme', isPreferDark())
