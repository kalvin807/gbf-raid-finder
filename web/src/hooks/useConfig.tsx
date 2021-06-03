import React, { createContext, useState, useContext } from 'react'

interface Config {
  darkMode: boolean
}

const initialState: Config = { darkMode: true }

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
const ConfigStore = createContext({ state: initialState, dispatch: (state: Config) => {} })

export const ConfigProvider = ({ children }: { children: any }) => {
  const [state, dispatch] = useState(initialState)

  return <ConfigStore.Provider value={{ state, dispatch }}>{children}</ConfigStore.Provider>
}

export function useConfig() {
  return useContext(ConfigStore)
}
