import 'inter-ui'
import '@reach/dialog/styles.css'
import React, { StrictMode, Suspense } from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import ThemeProvider, { ThemedGlobalStyle } from './theme'
import { Provider as JotaiProvider } from 'jotai'
import DataStore from './components/DataStore'
import LoadingScreen from './components/LoadingScreen'

ReactDOM.render(
  <StrictMode>
    <JotaiProvider>
      <ThemeProvider>
        <Suspense fallback={<LoadingScreen />}>
          <DataStore />
          <ThemedGlobalStyle />
          <App />
        </Suspense>
      </ThemeProvider>
    </JotaiProvider>
  </StrictMode>,
  document.getElementById('root')
)
