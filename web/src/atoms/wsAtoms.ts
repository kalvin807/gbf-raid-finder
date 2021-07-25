import { atom, PrimitiveAtom } from 'jotai'
import { atomWithStorage, splitAtom } from 'jotai/utils'
import { ReadyState } from 'react-use-websocket'
import { Raid } from './gbfAtom'

type Message = string

export interface Board extends Raid {
  isAutoCopy: boolean
  isAlert: boolean
}

const defaultConfig = {
  isAutoCopy: false,
  isAlert: false,
}

export const messageAtom = atom<PrimitiveAtom<Message>[]>([])
export const statusAtom = atom<ReadyState>(ReadyState.CLOSED)
export const boardAtom = atomWithStorage<Board[]>('board', [])
export const boardAtomsAtom = splitAtom(boardAtom)

export const boardMessagesAtom = atom<PrimitiveAtom<Message>[]>([])

export const updateBoardAtom = atom(null, (get, set, raid: Raid) => {
  const prev = get(boardAtom)
  if (prev.findIndex((board) => board.id === raid.id) >= 0) {
    return set(
      boardAtom,
      prev.filter((board) => board.id !== raid.id)
    )
  }
  set(boardAtom, [...prev, { ...raid, ...defaultConfig }])
})
