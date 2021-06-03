import React, { createContext, useState, useRef, useContext, useEffect, useReducer } from 'react'

interface Message {
  raidID: number
}

interface MessageStore {
  connected: boolean
  msg: Message[]
  listen: Set<number>
  raidAvailable: any
  catagoriesAvailable: any
}

interface Action {
  type: string
  data: any
}

const initialState: MessageStore = {
  connected: false,
  msg: [],
  listen: new Set([]),
  raidAvailable: {},
  catagoriesAvailable: {},
}

const reducer = (state: MessageStore, action: Action) => {
  switch (action.type) {
    case 'TOGGLE_CONNECT':
      return {
        ...state,
        connected: !state.connected,
      }
    case 'ADD_MESSAGE':
      return {
        ...state,
        msg: [...state.msg, action.data],
      }
    case 'ADD_LISTEN':
      state.listen.add(action.data)
      return state
    case 'REMOVE_LISTEN':
      state.listen.delete(action.data)
      return state
    default:
      throw new Error(`Invalid action type: ${action.type}`)
  }
}

const MsgStore = createContext<{
  state: MessageStore
  dispatch: React.Dispatch<Action>
}>({ state: initialState, dispatch: () => null })

export const MessageProvider = ({ children }: { children: any }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const ws = useRef<WebSocket | null>(null)

  useEffect(() => {
    const URL = process.env.NODE_ENV === 'development' ? 'ws://localhost:8080/ws' : (process.env.WS_URL as string)
    ws.current = new WebSocket(URL)
    ws.current.onopen = () => console.log('ws opened')
    ws.current.onclose = () => console.log('ws closed')
    ws.current.onmessage = (e) => {
      const message = JSON.parse(e.data)
      console.log('e', message)
    }

    return () => {
      if (ws.current !== null) {
        ws.current.close()
        ws.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (ws.current !== null) {
      dispatch({ type: 'TOGGLE_CONNECT', data: null })
    } else {
      dispatch({ type: 'TOGGLE_CONNECT', data: null })
    }
  }, [ws])

  useEffect(() => {
    if (ws.current !== null && ws.current.readyState === 1) {
      ws.current.send(JSON.stringify({ raid: [...state.listen] }))
    }
  }, [state.listen])

  return <MsgStore.Provider value={{ state, dispatch }}>{children}</MsgStore.Provider>
}

export function useMessage() {
  return useContext(MsgStore)
}
