import React from 'react'
import ReactDOM from 'react-dom'
import 'inter-ui/inter-hinted.css'

import App from './App'
import ThemeProvider, { FixedGlobalStyle, ThemedGlobalStyle } from './theme'
import { ConfigProvider } from 'hooks/useConfig'
import { MessageProvider } from 'hooks/useMessage'

ReactDOM.render(
  <React.StrictMode>
    <ConfigProvider>
      <MessageProvider>
        <FixedGlobalStyle />
        <ThemeProvider>
          <ThemedGlobalStyle />
          <App />
        </ThemeProvider>
      </MessageProvider>
    </ConfigProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
