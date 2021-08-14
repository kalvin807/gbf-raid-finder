import React, { StrictMode, Suspense } from 'react'
import ReactDOM from 'react-dom'
import { Provider as JotaiProvider } from 'jotai'

import './i18n'
import './migrate'

import DataStore from './components/DataStore'
import LoadingScreen from './components/LoadingScreen'
import App from './App'
import ThemeProvider, { ThemedGlobalStyle } from './theme'

import '@reach/dialog/styles.css'

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
