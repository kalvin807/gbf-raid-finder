import { useCallback, useEffect } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { atom } from 'jotai'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'

import { categoryAtom, fetchCategory, fetchRaid, writeRaidAtom } from 'atoms/gbfAtom'
import { clockAtom } from 'atoms/settingsAtom'
import { boardAtom, statusAtom, writeMsgStoreAtom } from 'atoms/wsAtoms'

/**
 * A Empty component to do data action within the react component root.
 **/
const DataStore = () => {
  const board = useAtomValue(boardAtom)

  const setMessage = useUpdateAtom(writeMsgStoreAtom)
  const setStatus = useUpdateAtom(statusAtom)
  const setCategory = useUpdateAtom(categoryAtom)
  const setRaid = useUpdateAtom(writeRaidAtom)
  const setClock = useUpdateAtom(clockAtom)

  const updateClock = useCallback(() => {
    setClock(Date.now())
  }, [setClock])

  const onMessage = (e: MessageEvent) => setMessage(e)
  const onOpen = () => setStatus(ReadyState.OPEN)
  const onClose = () => setStatus(ReadyState.CLOSED)

  const { sendJsonMessage } = useWebSocket('ws://gbf-raids-finder.herokuapp.com/ws', {
    onMessage: onMessage,
    onOpen: onOpen,
    onClose: onClose,
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
  }, [setRaid, setCategory])

  useEffect(() => {
    if (sendJsonMessage) {
      const activeId = board.filter((atom) => atom.id).map(({ id }) => id)
      sendJsonMessage({ raid: activeId })
    }
  }, [sendJsonMessage, board])

  useEffect(() => {
    const clock = setInterval(updateClock, 1000)
    return () => {
      clearInterval(clock)
    }
  }, [updateClock])

  return null
}

export default DataStore
