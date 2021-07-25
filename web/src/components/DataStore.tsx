import React from 'react'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { boardAtom, messageAtom, statusAtom } from 'atoms/wsAtoms'
import { useEffect } from 'react'
import { Raid, categoryAtom, fetchCategory, fetchRaid, raidAtom, writeRaidAtom } from 'atoms/gbfAtom'
import { atom, PrimitiveAtom } from 'jotai'

/**
 * A Empty component to do data action within the react component root.
 **/
const DataStore = () => {
  const board = useAtomValue(boardAtom)

  const setMessage = useUpdateAtom(messageAtom)
  const setStatus = useUpdateAtom(statusAtom)
  const setCategory = useUpdateAtom(categoryAtom)
  const setRaid = useUpdateAtom(writeRaidAtom)

  const addMessage = (e: MessageEvent) => {
    const msg = e.data
    setMessage((prev) => [...prev, msg])
  }

  const { sendJsonMessage } = useWebSocket('wss://echo.websocket.org', {
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
      const categories = Object.entries(res).map(([k, v], id) =>
        atom({ id, en: k, ja: v as string, isSelected: false })
      )
      setCategory(categories)
    })
    fetchRaid().then((res: Array<any>) => {
      const raids = res.map((obj: any, id) => ({ ...obj, id, isSelected: false }))
      setRaid(raids)
    })
  }, [setCategory, setRaid])

  useEffect(() => {
    if (sendJsonMessage) {
      const activeId = board.filter((atom) => atom.id).map(({ id }) => id)
      sendJsonMessage({ raid: activeId })
    }
  }, [board, sendJsonMessage])

  return <></>
}

export default DataStore
