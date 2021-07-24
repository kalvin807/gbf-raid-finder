import React, { createContext, useState, useRef, useContext, useEffect, useReducer } from 'react'

interface Message {
  raidID: number
}

interface DataStore {
  connected: boolean
  msg: Message[]
  listen: Set<number>
  raidAvailable: any
  catagoriesAvailable: any
}

interface Action {
  type: string
  data: any
}

const initialState: DataStore = {
  connected: false,
  msg: [],
  listen: new Set([]),
  raidAvailable: {},
  catagoriesAvailable: {},
}
