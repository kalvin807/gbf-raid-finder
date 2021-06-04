import React, { createContext, useState, useRef, useContext, useEffect, useReducer } from 'react'
import useFetch from './useFetch'

interface Message {
  raidID: number
}

interface DataStore {
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

const initialState: DataStore = {
  connected: false,
  msg: [],
  listen: new Set([]),
  raidAvailable: {},
  catagoriesAvailable: {},
}

const reducer = (state: DataStore, action: Action): DataStore => {
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
    case 'SET_RAID':
      return {
        ...state,
        raidAvailable: action.data,
      }
    case 'SET_CATEGORIES':
      return {
        ...state,
        catagoriesAvailable: action.data,
      }
    case 'REMOVE_LISTEN':
      state.listen.delete(action.data)
      return state
    default:
      throw new Error(`Invalid action type: ${action.type}`)
  }
}

const DataStore = createContext<{
  state: DataStore
  dispatch: React.Dispatch<Action>
}>({ state: initialState, dispatch: () => null })

const URLs =
  process.env.NODE_ENV === 'development'
    ? {
        ws: 'ws://localhost:8080/ws',
        raid: 'http://localhost:8080/raid',
        category: 'http://localhost:8080/category',
      }
    : {
        ws: process.env.WEBSOCKET_URI as string,
        raid: process.env.BACKEND_URL + '/raid',
        category: process.env.BACKEND_URL + '/raid',
      }

export const DataProvider = ({ children }: { children: any }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const ws = useRef<WebSocket | null>(null)
  const { data: raid } = useFetch(URLs.raid)
  const { data: category } = useFetch(URLs.category)

  useEffect(() => {
    ws.current = new WebSocket(URLs.ws)
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
    if (raid) {
      dispatch({ type: 'SET_RAID', data: raid })
    }
  }, [raid])

  useEffect(() => {
    if (category) {
      dispatch({ type: 'SET_CATEGORIES', data: category })
    }
  }, [category])

  useEffect(() => {
    if (ws.current !== null && ws.current.readyState === 1) {
      ws.current.send(JSON.stringify({ raid: [...state.listen] }))
    }
  }, [state.listen])

  useEffect(() => {
    if (ws.current !== null) {
      dispatch({ type: 'TOGGLE_CONNECT', data: null })
    } else {
      dispatch({ type: 'TOGGLE_CONNECT', data: null })
    }
  }, [ws])

  return <DataStore.Provider value={{ state, dispatch }}>{children}</DataStore.Provider>
}

export function useData() {
  return useContext(DataStore)
}
