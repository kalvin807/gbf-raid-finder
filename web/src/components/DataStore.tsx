import { useCallback, useEffect, useState } from 'react'
import { useAtom } from 'jotai'
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
  const setMapping = useUpdateAtom(updateRaidBoardAtom)

  const setCategory = useUpdateAtom(categoryAtom)
  const setRaid = useUpdateAtom(raidAtom)
  const setClock = useUpdateAtom(clockAtom)

  const updateClock = useCallback(() => {
    setClock(Date.now())
  }, [setClock])

  useEffect(() => {
    async function fetchData() {
      const [category, raid] = await Promise.all([fetchCategory(), fetchRaid()])
      setCategory(category)
      setRaid(raid.map((v: any, k: any) => ({ ...v, id: k })))
    }
    fetchData()
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
      const activeId = Object.keys(mapping).map((v) => parseInt(v, 10))
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
