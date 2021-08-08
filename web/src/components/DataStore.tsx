import { useCallback, useEffect } from 'react'
import { atom, useAtom } from 'jotai'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'

import { categoryAtom, fetchCategory, fetchRaid, writeRaidAtom } from 'atoms/gbfAtom'
import { clockAtom } from 'atoms/settingsAtom'
import { boardsAtom, writeMsgStoreAtom, ws, wsState } from 'atoms/wsAtoms'
import { SubscribeRequest } from 'utils/messages'

/**
 * A Empty component to do data action within the react component root.
 **/
const DataStore = () => {
  const board = useAtomValue(boardsAtom)
  const [state, setWsState] = useAtom(wsState)

  const setMessage = useUpdateAtom(writeMsgStoreAtom)
  const setCategory = useUpdateAtom(categoryAtom)
  const setRaid = useUpdateAtom(writeRaidAtom)
  const setClock = useUpdateAtom(clockAtom)

  const updateClock = useCallback(() => {
    setClock(Date.now())
  }, [setClock])

  useEffect(() => {
    fetchCategory().then((res: { [k: string]: { en: string; ja: string } }) => {
      const categories = Object.entries(res).map(([k, v]) => atom({ id: k, en: v.en, ja: v.ja, isSelected: false }))
      setCategory(categories)
    })
    fetchRaid().then((res: Array<any>) => {
      const raids = res.map((obj: any, id) => ({ ...obj, id, isSelected: false }))
      setRaid(raids)
    })
  }, [setRaid, setCategory])

  useEffect(() => {
    if (state === WebSocket.OPEN) {
      const activeId = board.filter((atom) => atom.id).map(({ id }) => id)
      const buf = SubscribeRequest.toBinary({ raid: activeId, config: '' })
      ws.send(buf)
    }
  }, [board, state])

  useEffect(() => {
    const clock = setInterval(updateClock, 1000)
    return () => {
      clearInterval(clock)
    }
  }, [updateClock])

  useEffect(() => {
    const onMessage = (e: MessageEvent) => setMessage(e)
    const onOpen = () => {
      console.log('Ws connected')
      setWsState(WebSocket.OPEN)
    }
    const onClose = () => {
      console.log('Ws closed')
      setWsState(WebSocket.CLOSED)
    }
    ws.onmessage = onMessage
    ws.onclose = onClose
    ws.onopen = onOpen
  }, [setMessage, setWsState])

  return null
}

export default DataStore
