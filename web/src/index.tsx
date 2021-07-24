import 'inter-ui'
import '@reach/dialog/styles.css'
import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import ThemeProvider, { ThemedGlobalStyle } from './theme'
import { Provider as JotaiProvider } from 'jotai'
import DataStore from 'components/DataStore'
import LoadingScreen from 'components/LoadingScreen'

ReactDOM.render(
  <React.StrictMode>
    {/* {// TODO: Add fallback} */}
    <JotaiProvider>
      <React.Suspense fallback={() => <LoadingScreen />}>
        <ThemeProvider>
          <ThemedGlobalStyle />
          <App />
        </ThemeProvider>
        <DataStore />
      </React.Suspense>
    </JotaiProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
