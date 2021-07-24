import React from 'react'
import ReactDOM from 'react-dom'
import 'inter-ui'

import App from './App'
import ThemeProvider, { FixedGlobalStyle, ThemedGlobalStyle } from './theme'
import { Provider as JotaiProvider } from 'jotai'
import DataStore from 'components/DataStore'

ReactDOM.render(
  <React.StrictMode>
    {/* {// TODO: Add fallback} */}
    <JotaiProvider>
      <DataStore />
      <React.Suspense fallback={() => <></>}>
        <FixedGlobalStyle />
        <ThemeProvider>
          <ThemedGlobalStyle />
          <App />
        </ThemeProvider>
      </React.Suspense>
    </JotaiProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
