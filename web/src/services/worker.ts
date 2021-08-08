import { WS_URL } from '../statics/constant'
import { RaidMessage, SubscribeRequest } from '../utils/messages'

import type { WorkerRequest } from './worker.type'

let ws = new WebSocket(WS_URL)
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

onmessage = function (actionEvent) {
  console.log('onmessage', actionEvent)
  const { type, value } = actionEvent.data as WorkerRequest
  switch (type) {
    case 'send':
      if (value && ws && ws.readyState === WebSocket.OPEN) {
        const buf = SubscribeRequest.toBinary({ ...value, config: '' })
        ws.send(buf)
      }
      break
    case 'start':
      ws = new WebSocket(WS_URL)
      break
    case 'stop':
      ws.close()
      break
    case 'restart':
      if (ws && ws.readyState === WebSocket.OPEN) ws.close()
      ws = new WebSocket(WS_URL)
      break
    default:
      console.log('Websocket received unknown action:', actionEvent.data)
  }
}
