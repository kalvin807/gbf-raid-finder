import { Draft } from 'immer'
import { atom, WritableAtom } from 'jotai'
import { atomWithImmer, withImmer } from 'jotai/immer'
import { atomWithStorage } from 'jotai/utils'
import { nanoid } from 'nanoid'

import { RaidMessage as RaidMessageRaw } from 'utils/messages'

import { Raid, raidAtom } from './gbfAtom'
import { maxMessageAtom } from './settingsAtom'

export interface Board {
  subscribe: number[]
  name: string | null
  isAutoCopy: boolean
  isAlert: boolean
}

const defaultBoard: Board = {
  subscribe: [],
  name: null,
  isAutoCopy: false,
  isAlert: false,
}

export interface Message extends Raid {
  raid: string
  msg: string
  roomId: string
  timestamp: Date
  isCopied: false
}

export type BoardAtom = WritableAtom<Board, Board | ((draft: Draft<Board>) => void)>
export type MessageAtom = WritableAtom<Message, Message | ((draft: Draft<Message>) => void)>
export type MessagesAtom = WritableAtom<MessageAtom[], MessageAtom[] | ((draft: Draft<MessageAtom>[]) => void)>

type BoardStore = Record<string, Board>
type MessagesStore = Record<string, MessageAtom[]>

interface BoardAction {
  type: 'ADD' | 'REMOVE' | 'RESET'
  value?: string
}

const genBoardID = (): string => nanoid(8)

export const boardsAtom = withImmer(atomWithStorage<BoardStore>('board', {}))
export const boardsIdAtom = atom((get) => {
  const boards = get(boardsAtom)
  if (Array.isArray(boards)) return []
  return Object.keys(boards)
})
export const reduceBoardsAtom = atom(null, (_, set, update: BoardAction) => {
  switch (update.type) {
    case 'ADD':
      set(boardsAtom, (draft) => {
        draft[genBoardID()] = defaultBoard
      })
      break
    case 'REMOVE':
      if (update.value) {
        const value = update.value
        set(boardsAtom, (draft) => {
          delete draft[value]
        })
      }
      break
    case 'RESET':
      set(boardsAtom, () => {
        return {}
      })
      break
  }
})

export const raidBoardMapAtom = atom<Record<string, string[]>>({})
export const updateRaidBoardAtom = atom(null, (get, set) => {
  const boards = get(boardsAtom)
  if (Array.isArray(boards)) return // Don't react to old format
  set(raidBoardMapAtom, () => {
    const mapping: Record<string, string[]> = {}
    for (const [id, board] of Object.entries(boards)) {
      const sub = board.subscribe
      const l = sub.length
      for (let i = 0; i < l; i++) {
        const raidId = sub[i].toString()
        ;(mapping[raidId] = mapping[raidId] || []).push(id)
      }
    }
    return mapping
  })
})

export const messageStoreAtom = atomWithImmer<MessagesStore>({})
export const updateMsgStoreAtom = atom(null, (get, set, update: RaidMessageRaw) => {
  const mapping = get(raidBoardMapAtom)
  const maxLength = get(maxMessageAtom)
  const raids = get(raidAtom)
  set(messageStoreAtom, (draft) => {
    const { raid, timestamp } = update
    const msg = atomWithImmer<Message>({
      ...update,
      ...raids[raid],
      raid: raid.toString(),
      timestamp: new Date(timestamp),
      isCopied: false,
    })

    const boardIds = mapping[raid]
    if (!boardIds) return // No board for this raid
    const l = boardIds.length

    for (let i = 0; i < l; i++) {
      const boardId = boardIds[i]
      if (boardId in draft) {
        const curLength = draft[boardId].length
        if (curLength >= maxLength) {
          const diff = curLength - maxLength
          draft[boardId].splice(curLength - diff - 1, diff + 1)
        }
        draft[boardId].unshift(msg)
      } else {
        draft[boardId] = [msg]
      }
    }
  })
})
