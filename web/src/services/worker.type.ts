import type { RaidMessage } from 'utils/messages'

export interface WorkerRequest {
  type: 'send' | 'start' | 'stop' | 'restart'
  value?: { raid: number[] }
}

export interface WorkerResponse {
  type: 'message' | 'status'
  value: number | RaidMessage
}
