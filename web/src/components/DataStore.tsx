import { useCallback, useEffect, useState } from 'react'
import { atom, useAtom } from 'jotai'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { WorkerResponse } from 'services/worker.type'

import { categoryAtom, fetchCategory, fetchRaid, raidAtom } from 'atoms/gbfAtom'
import { clockAtom, wsStateAtom } from 'atoms/settingsAtom'
import { boardsAtom, raidBoardMapAtom, updateMsgStoreAtom, updateRaidBoardAtom } from 'atoms/wsAtoms'
import { RaidMessage as RaidMessageRaw } from 'utils/messages'

import WebsocketWorker from '../services/worker?worker'

export const worker = new WebsocketWorker()
/**
 * A Empty component to do data action within the react component root.
 **/
const DataStore = () => {
  const [workerReady, setWorkerReady] = useState(false)

  const board = useAtomValue(boardsAtom)
  const mapping = useAtomValue(raidBoardMapAtom)

  const [wsState, setWsState] = useAtom(wsStateAtom)
  const setMessage = useUpdateAtom(updateMsgStoreAtom)
  const setCategory = useUpdateAtom(categoryAtom)
  const setRaid = useUpdateAtom(raidAtom)
  const setMapping = useUpdateAtom(updateRaidBoardAtom)
  const setClock = useUpdateAtom(clockAtom)

  const updateClock = useCallback(() => {
    setClock(Date.now())
  }, [setClock])

  useEffect(() => {
    fetchCategory()
      .then((res: { [k: string]: { en: string; ja: string } }) => {
        if (res) {
          const categories = Object.entries(res).map(([k, v]) => atom({ id: k, en: v.en, ja: v.ja, isSelected: false }))
          setCategory(categories)
        }
      })
      .catch((e) => console.error(e))
    fetchRaid()
      .then((res: Array<any>) => {
        if (res) {
          const raids = res.map((obj: any, id) => ({ ...obj, id, isSelected: false }))
          setRaid(raids)
        }
      })
      .catch((e) => console.error(e))
  }, [setRaid, setCategory])

  // Heartbeat
  useEffect(() => {
    const clock = setInterval(updateClock, 1000)
    return () => {
      clearInterval(clock)
    }
  }, [updateClock])

  // Update mapping when any board is changed
  useEffect(() => {
    setMapping()
  }, [board, setMapping])

  // Push subscribe to the worker when new raid is need to be fetched.
  useEffect(() => {
    if (window.Worker && workerReady && wsState === WebSocket.OPEN) {
      const activeId = Object.keys(mapping)
      worker.postMessage({ type: 'send', value: { raid: activeId } })
    }
  }, [mapping, workerReady, wsState])

  // Set up web worker
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
    setWorkerReady(true)
  }, [setWsState, setMessage])

  return null
}

export default DataStore
