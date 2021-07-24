import React from 'react'
import { useUpdateAtom } from 'jotai/utils'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { messageAtom, statusAtom } from 'atoms/wsAtoms'

/**
 * A Empty component to do data action within the react component root.
 **/
const DataStore = () => {
  const setMessage = useUpdateAtom(messageAtom)
  const setStatus = useUpdateAtom(statusAtom)

  const addMessage = (e: MessageEvent) => {
    const msg = e.data
    setMessage((prev) => [...prev, msg])
  }

  useWebSocket('wss://echo.websocket.org', {
    share: true,
    onMessage: addMessage,
    onOpen: () => setStatus(ReadyState.OPEN),
    onClose: () => setStatus(ReadyState.CLOSED),
  })
  console.log('loaded')
  return <></>
}

export default DataStore
