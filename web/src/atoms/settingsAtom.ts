import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

// Check if browser prefer dark theme
const isPreferDark = (): boolean => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return true
  }
  return false
}

export enum CopyAction {
  ONLY_COPY = 'copy_only',
  NEW_TAB = 'copy_open_tab',
  SKYLEAP = 'copy_open_skyleap',
  MOBAGE = 'copy_open_mobage',
}

export const themeAtom = atomWithStorage('darkTheme', isPreferDark())
export const maxMessageAtom = atomWithStorage('maxMessage', 5)
export const copyActionAtom = atomWithStorage<CopyAction>('copyAction', CopyAction.ONLY_COPY)
export const clockAtom = atom(0)
export const modalAtom = atom(false)
export const settingAtom = atom(false)
export const wsStateAtom = atom(WebSocket.CONNECTING)
