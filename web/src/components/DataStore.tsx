import { useCallback, useEffect, useState } from 'react'
import { atom, useAtom } from 'jotai'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { WorkerResponse } from 'services/worker.type'

import { categoryAtom, fetchCategory, fetchRaid, writeRaidAtom } from 'atoms/gbfAtom'
import { clockAtom } from 'atoms/settingsAtom'
import { boardsAtom, writeMsgStoreAtom, wsStateAtom } from 'atoms/wsAtoms'
import { RaidMessage as RaidMessageRaw } from 'utils/messages'

import WebsocketWorker from '../services/worker?worker'

const worker = new WebsocketWorker()
/**
 * A Empty component to do data action within the react component root.
 **/
const DataStore = () => {
  const [workerReady, setWorkerReady] = useState(false)

  const board = useAtomValue(boardsAtom)

  const [wsState, setWsState] = useAtom(wsStateAtom)
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
    const clock = setInterval(updateClock, 1000)
    return () => {
      clearInterval(clock)
    }
  }, [updateClock])

  useEffect(() => {
    if (window.Worker && workerReady && wsState === WebSocket.OPEN) {
      const activeId = board.filter((atom) => atom.id).map(({ id }) => id)
      worker.postMessage({ type: 'send', value: { raid: activeId } })
    }
  }, [board, workerReady, wsState])

  useEffect(() => {
    const onWorkerResponse = (res: MessageEvent<WorkerResponse>) => {
      const { type, value } = res.data
      switch (type) {
        case 'status':
          setWsState(value as number)
          break
        case 'message':
          setMessage(value as RaidMessageRaw)
          break
        default:
          console.log(`Unknown worker response: ${type}`)
      }
    }
    worker.onmessage = onWorkerResponse
    console.log(worker)
    setWorkerReady(true)
  }, [setWsState, setMessage])

  return null
}

export default DataStore
