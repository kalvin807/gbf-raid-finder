import React, { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider as JotaiProvider } from 'jotai'

import './i18n'
import './migrate'
import '@fontsource/inter'

import DataStore from './components/DataStore'
import LoadingScreen from './components/LoadingScreen'
import App from './App'
import ThemeProvider, { ThemedGlobalStyle } from './theme'

const container = document.getElementById('root')
if (container) {
  const root = createRoot(container)
  root.render(
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
    </StrictMode>
  )
} else {
  console.error('Could not find root container')
}
