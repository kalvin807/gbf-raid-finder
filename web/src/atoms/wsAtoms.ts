import { atom, PrimitiveAtom } from 'jotai'
import { atomWithImmer, withImmer } from 'jotai/immer'
import { atomWithStorage, splitAtom } from 'jotai/utils'

import { WS_URL } from 'statics/constant'
import { RaidMessage as RaidMessageRaw } from 'utils/messages'

import { Raid, raidAtom } from './gbfAtom'
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
  isCopied: false
}

export interface MessageRaw {
  raid: string
  msg: string
  roomId: string
  timestamp: Date
}

interface MessagesStore {
  [raidID: string]: PrimitiveAtom<Message>[]
}

type Action = 'add' | 'remove' | 'reset'
export const ws = new WebSocket(WS_URL)
ws.binaryType = 'arraybuffer'
export const wsStateAtom = atom(WebSocket.CONNECTING)

export const boardsAtom = atomWithStorage<Board[]>('board', [])
export const activeBoardsIdAtom = atom((get) => {
  const boards = get(boardsAtom)
  return boards.map((b) => b.id)
})
export const boardAtomsAtom = splitAtom(boardsAtom)
export const updateBoardAtom = atom(null, (get, set, update: { raid?: Raid; action: Action }) => {
  const { raid, action } = update
  const prev = get(boardsAtom)
  const boardImmer = withImmer(boardsAtom)
  const prevIdx = raid ? prev.findIndex((b) => b.id === raid.id) : -1

  if (raid && action === 'add' && prevIdx === -1) {
    set(boardImmer, (draft) => {
      if (prevIdx === -1) draft.push({ ...raid, ...defaultConfig })
    })
    set(messageStoreAtom, (draft) => {
      draft[raid.id] = []
    })
    const raidIdx = get(raidAtom).findIndex((i) => get(i).id === raid.id)
    const r = get(raidAtom)[raidIdx]
    set(r, (prev) => ({ ...prev, isSelected: true }))
  }

  if (raid && action === 'remove' && prevIdx !== -1) {
    set(boardImmer, (draft) => {
      draft.splice(prevIdx, 1)
    })
    const raidIdx = get(raidAtom).findIndex((i) => get(i).id === raid.id)
    const r = get(raidAtom)[raidIdx]
    set(r, (prev) => ({ ...prev, isSelected: false }))
  }

  if (action === 'reset') {
    set(boardImmer, () => {
      return []
    })
    set(messageStoreAtom, () => {
      return {}
    })
    get(raidAtom).forEach((r) => {
      set(r, (prev) => ({ ...prev, isSelected: false }))
    })
  }
})

export const messageStoreAtom = atomWithImmer<MessagesStore>({})
export const readMsgStoreAtom = atom((get) => get(messageStoreAtom))
export const writeMsgStoreAtom = atom(null, (get, set, update: RaidMessageRaw) => {
  set(messageStoreAtom, (draft) => {
    const { raid, timestamp } = update
    const msg = atom<Message>({ ...update, raid: raid.toString(), timestamp: new Date(timestamp), isCopied: false })
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
