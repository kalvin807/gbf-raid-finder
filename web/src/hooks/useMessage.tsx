import React, { createContext, useState, useRef, useContext, useEffect } from 'react'

interface Message {
  raidID: number
}

interface MessageStore {
  connected: boolean
  msg: Message[]
}

const initialState: MessageStore = { connected: false, msg: [] }

const MsgStore = createContext(initialState)

export const MessageProvider = ({ children }: { children: any }) => {
  const [state, dispatch] = useState(initialState)
  const ws = useRef<WebSocket | null>(null)

  useEffect(() => {
    const URL = process.env.NODE_ENV === 'development' ? 'ws://localhost' : (process.env.WS_URL as string)
    ws.current = new WebSocket(URL)
    ws.current.onopen = () => console.log('ws opened')
    ws.current.onclose = () => console.log('ws closed')
    ws.current.onmessage = (e) => {
      const message = JSON.parse(e.data)
      console.log('e', message)
    }

    if (ws.current) {
      dispatch((state) => ({ ...state, connected: true }))
    }

    return () => {
      if (ws.current !== null) {
        ws.current.close()
        ws.current = null
      }
    }
  }, [])

  return <MsgStore.Provider value={state}>{children}</MsgStore.Provider>
}

export function useMessage() {
  return useContext(MsgStore)
}
