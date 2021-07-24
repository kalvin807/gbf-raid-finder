import React from 'react'
import { useUpdateAtom } from 'jotai/utils'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { messageAtom, statusAtom } from 'atoms/wsAtoms'
import { useEffect } from 'react'
import { categoryAtom, fetchCategory, fetchRaid, raidAtom } from 'atoms/gbfAtom'

/**
 * A Empty component to do data action within the react component root.
 **/
const DataStore = () => {
  const setMessage = useUpdateAtom(messageAtom)
  const setStatus = useUpdateAtom(statusAtom)
  const setCategory = useUpdateAtom(categoryAtom)
  const setRaid = useUpdateAtom(raidAtom)
  const addMessage = (e: MessageEvent) => {
    const msg = e.data
    setMessage((prev) => [...prev, msg])
  }

  useWebSocket('wss://echo.websocket.org', {
    share: true,
    onMessage: addMessage,
    onOpen: () => {
      console.log('loaded')
      setStatus(ReadyState.OPEN)
    },
    onClose: () => setStatus(ReadyState.CLOSED),
  })

  useEffect(() => {
    fetchCategory().then((res) => {
      setCategory(res)
    })
    fetchRaid().then((res) => {
      setRaid(res)
    })
  }, [setCategory, setRaid])

  return <></>
}

export default DataStore
