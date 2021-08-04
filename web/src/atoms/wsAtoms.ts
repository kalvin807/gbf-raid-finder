import { ReadyState } from 'react-use-websocket'
import { Atom, atom, PrimitiveAtom } from 'jotai'
import { atomWithImmer, withImmer } from 'jotai/immer'
import { atomWithStorage, splitAtom } from 'jotai/utils'

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
  isCopied: false
}

interface MessagesStore {
  [raidID: string]: PrimitiveAtom<Message>[]
}

type Action = 'add' | 'remove'

export const statusAtom = atom<ReadyState>(ReadyState.CLOSED)

export const boardAtom = atomWithStorage<Board[]>('board', [])
export const boardAtomsAtom = splitAtom(boardAtom)
export const updateBoardAtom = atom(null, (get, set, update: { raid: Raid; action: Action }) => {
  const { raid, action } = update
  const boardImmer = withImmer(boardAtom)
  set(boardImmer, (draft) => {
    const prevIdx = draft.findIndex((b) => b.id === raid.id)
    if (action === 'add' && prevIdx === -1) {
      draft.push({ ...raid, ...defaultConfig })
      set(messageStoreAtom, (draft) => {
        draft[raid.id] = []
        return draft
      })
    }
    if (action === 'remove' && prevIdx !== -1) {
      draft.splice(prevIdx, 1)
      set(messageStoreAtom, (draft) => {
        delete draft[raid.id]
        return draft
      })
    }
    return draft
  })
})

export const messageStoreAtom = atomWithImmer<MessagesStore>({})
export const readMsgStoreAtom = atom((get) => get(messageStoreAtom))
export const writeMsgStoreAtom = atom(null, (get, set, update: MessageEvent<string>) => {
  set(messageStoreAtom, (draft) => {
    const raidMessage: Message = JSON.parse(update.data)
    const { raid, timestamp } = raidMessage
    const msg = atom<Message>({ ...raidMessage, timestamp: new Date(timestamp), isCopied: false })
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
