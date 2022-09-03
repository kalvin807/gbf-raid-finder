import React from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

function SWUpdater() {
  const intervalMS = 60 * 60 * 1000
  const updateServiceWorker = useRegisterSW({
    onRegistered(r) {
      r &&
        setInterval(() => {
          r.update()
        }, intervalMS)
    },
  })

  return null
}

export default SWUpdater
