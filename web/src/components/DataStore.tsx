import React from 'react'
import { useUpdateAtom } from 'jotai/utils'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { messageAtom, statusAtom } from 'atoms/wsAtoms'
import { useEffect } from 'react'
import { Raid, categoryAtom, fetchCategory, fetchRaid, raidAtom } from 'atoms/gbfAtom'
import { atom, PrimitiveAtom } from 'jotai'

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
      const categories = Object.entries(res).map(([k, v]) => atom({ en: k, ja: v as string, isSelected: false }))
      setCategory(categories)
    })
    fetchRaid().then((res: Array<any>) => {
      const atoms = res.map((obj: any) => atom({ ...obj, isSelected: false }))
      setRaid(atoms)
    })
  }, [setCategory, setRaid])

  return <></>
}

export default DataStore
