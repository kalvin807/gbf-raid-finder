import ReactGA from 'react-ga4'
import { getCLS, getFID, getLCP } from 'web-vitals'

export function sendToGoogleAnalytics({
  name,
  delta,
  value,
  id,
}: {
  name: string
  delta: number
  value: number
  id: string
}) {
  ReactGA.send({
    hitType: 'event',
    eventCategory: 'Web Vitals',
    eventAction: name,
    eventLabel: id,
    nonInteraction: true,
    value: Math.round(name === 'CLS' ? delta * 1000 : delta),

    metric_id: id,
    metric_value: value,
    metric_delta: delta,
  })
}

export function sendVitals() {
  try {
    getCLS(sendToGoogleAnalytics)
    getFID(sendToGoogleAnalytics)
    getLCP(sendToGoogleAnalytics)
  } catch (e) {
    return
  }
}
