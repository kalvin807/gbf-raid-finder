import { atom } from 'jotai'
import { atomWithImmer } from 'jotai/immer'
import { atomWithStorage, splitAtom } from 'jotai/utils'
import { ReadyState } from 'react-use-websocket'
import { Raid } from './gbfAtom'
import { maxMessageAtom } from './settingsAtom'

export interface Board extends Raid {
  isAutoCopy: boolean
  isAlert: boolean
}

const defaultConfig = {
  isAutoCopy: false,
  isAlert: false,
}

export interface Message {
  raid: string
  msg: string
  roomId: string
  timestamp: Date
}

interface MessagesStore {
  [raidID: string]: Message[]
}

export const statusAtom = atom<ReadyState>(ReadyState.CLOSED)

export const boardAtom = atomWithStorage<Board[]>('board', [])
export const boardAtomsAtom = splitAtom(boardAtom)
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

export const messageStoreAtom = atomWithImmer<MessagesStore>({})
export const readMsgStoreAtom = atom((get) => get(messageStoreAtom))
export const writeMessageAtom = atom(null, (get, set, update: MessageEvent<string>) => {
  set(messageStoreAtom, (draft) => {
    const raidMessage: Message = JSON.parse(update.data)
    const { raid, timestamp } = raidMessage
    const msg = { ...raidMessage, timestamp: new Date(timestamp) }
    if (raid in draft) {
      const maxLength = get(maxMessageAtom)
      if (draft[raid].length >= maxLength) {
        draft[raid].pop()
      }
      draft[raid].unshift(msg)
    } else {
      draft[raid] = [msg]
    }
    return draft
  })
})
