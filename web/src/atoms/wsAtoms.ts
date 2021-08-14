import { Draft } from 'immer'
import { Atom, atom, PrimitiveAtom, WritableAtom } from 'jotai'
import { atomWithImmer, withImmer } from 'jotai/immer'
import { atomWithStorage } from 'jotai/utils'
import { nanoid } from 'nanoid'

import { RaidMessage as RaidMessageRaw } from 'utils/messages'

import { maxMessageAtom } from './settingsAtom'

export interface Board {
  subscribe: number[]
  isAutoCopy: boolean
  isAlert: boolean
}

const defaultBoard: Board = {
  subscribe: [],
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

export type BoardAtom = WritableAtom<Board, Board | ((draft: Draft<Board>) => void)>
type BoardStore = Record<string, BoardAtom>
type MessagesStore = Record<string, Atom<Message>[]>

interface BoardAction {
  type: 'ADD' | 'REMOVE' | 'RESET'
  value?: string
}

const genBoardID = (): string => nanoid(8)

export const boardsAtom = withImmer(
  atomWithStorage<BoardStore>(
    'board',
    {},
    {
      getItem: (key: string) => {
        const raw = localStorage.getItem(key)
        if (raw) {
          const parsed: Record<string, { init: Board }> = JSON.parse(raw)

          if (Array.isArray(parsed)) return {} // Migrate from old version

          const withAtom: BoardStore = {}
          Object.entries(parsed).forEach(([k, v]) => {
            withAtom[k] = atomWithImmer(v.init)
          })
          return withAtom
        }
        return {}
      },
      setItem: (key: string, newValue: BoardStore) => {
        localStorage.setItem(key, JSON.stringify(newValue))
      },
    }
  )
)

export const reduceBoardsAtom = atom(null, (_, set, update: BoardAction) => {
  switch (update.type) {
    case 'ADD':
      set(boardsAtom, (draft) => {
        draft[genBoardID()] = atomWithImmer(defaultBoard)
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

export const raidBoardMapAtom = atomWithImmer<Record<string, string[]>>({})
export const updateRaidBoardAtom = atom(null, (get, set) => {
  const boards = get(boardsAtom)
  if (Array.isArray(boards)) return // Don't react to old format
  set(raidBoardMapAtom, () => {
    const mapping: Record<string, string[]> = {}
    for (const [id, board] of Object.entries(boards)) {
      const sub = get(board).subscribe
      const l = sub.length
      for (let i = 0; i < l; i++) {
        const raidId = sub[i]
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

  set(messageStoreAtom, (draft) => {
    const { raid, timestamp } = update
    const msg = atom<Message>({ ...update, raid: raid.toString(), timestamp: new Date(timestamp), isCopied: false })

    const boardIds = mapping[raid]
    const l = boardIds.length

    for (let i = 0; i < l; i++) {
      const boardId = boardIds[i]
      if (boardId in draft) {
        const queue = draft[boardId]
        const curLength = queue.length
        if (curLength >= maxLength) {
          const diff = curLength - maxLength
          queue.splice(curLength - diff - 1, diff + 1)
        }
        queue.unshift(msg)
      } else {
        draft[boardId] = [msg]
      }
    }

    return draft
  })
})
