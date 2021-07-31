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
    <JotaiProvider>
      <ThemeProvider>
        <React.Suspense fallback={() => <LoadingScreen />}>
          <DataStore />
          <ThemedGlobalStyle />
          <App />
        </React.Suspense>
      </ThemeProvider>
    </JotaiProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
