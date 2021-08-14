import { WS_URL } from '../statics/constant'
import { RaidMessage, SubscribeRequest } from '../utils/messages'

import type { WorkerRequest } from './worker.type'

const initWs = () => {
  try {
    const ws = new WebSocket(WS_URL)

    ws.binaryType = 'arraybuffer'

    ws.onopen = () => {
      console.log('WebSocket opened')
      postMessage({ type: 'status', value: WebSocket.OPEN })
    }

    ws.onclose = () => {
      console.log('WebSocket closed')
      postMessage({ type: 'status', value: WebSocket.CLOSED })
    }

    ws.onerror = (event) => {
      console.log('WebSocket error', event)
      postMessage({ type: 'status', value: WebSocket.CLOSED })
    }

    ws.onmessage = (event) => {
      const buffer = new Uint8Array(event.data)
      const msg = RaidMessage.fromBinary(buffer)
      postMessage({ type: 'message', value: msg })
    }
    return ws
  } catch (e) {
    console.log('WebSocket Init error', e)
    postMessage({ type: 'status', value: WebSocket.CLOSED })
  }
}

let ws = initWs()

onmessage = function (actionEvent) {
  const { type, value } = actionEvent.data as WorkerRequest
  switch (type) {
    case 'send':
      if (value && ws && ws.readyState === WebSocket.OPEN) {
        const buf = SubscribeRequest.toBinary({ ...value, config: '' })
        ws.send(buf)
      }
      break
    case 'start':
      ws = initWs()
      break
    case 'stop':
      if (ws) ws.close()
      break
    case 'restart':
      if (ws && ws.readyState === WebSocket.OPEN) ws.close()
      ws = initWs()
      break
    default:
      console.log('Websocket received unknown action:', actionEvent.data)
  }
}
