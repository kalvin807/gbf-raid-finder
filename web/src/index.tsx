import React from 'react'
import ReactDOM from 'react-dom'
import 'inter-ui'

import App from './App'
import ThemeProvider, { FixedGlobalStyle, ThemedGlobalStyle } from './theme'
import { ConfigProvider } from './hooks/useConfig'
import { DataProvider } from './hooks/useData'

ReactDOM.render(
  <React.StrictMode>
    {/* {// TODO: Add fallback} */}
    <React.Suspense fallback={() => <></>}>
      <ConfigProvider>
        <DataProvider>
          <FixedGlobalStyle />
          <ThemeProvider>
            <ThemedGlobalStyle />
            <App />
          </ThemeProvider>
        </DataProvider>
      </ConfigProvider>
    </React.Suspense>
  </React.StrictMode>,
  document.getElementById('root')
)
