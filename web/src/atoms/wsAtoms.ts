import { atom, PrimitiveAtom } from 'jotai'
import { ReadyState } from 'react-use-websocket'

type Message = string

export const messageAtom = atom<PrimitiveAtom<Message>[]>([])
export const statusAtom = atom<ReadyState>(ReadyState.CLOSED)

// Todo: presist it to localStorage
export const selectedAtom = atom([])
