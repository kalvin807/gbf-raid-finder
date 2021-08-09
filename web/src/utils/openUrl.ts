import { CopyAction } from 'atoms/settingsAtom'
import { GBF_NAME, GBF_URL, MOBAGE_URL, SKYLEAP_URL } from 'statics/constant'

let windowObjectReference: Window | null = null

export const handleCopyAction = (action: CopyAction) => {
  switch (action) {
    case CopyAction.NEW_TAB:
      openOrCreateTab(GBF_URL, GBF_NAME)
      break
    case CopyAction.SKYLEAP:
      openOrCreateTab(SKYLEAP_URL, '_blank')
      break
    case CopyAction.MOBAGE:
      openOrCreateTab(MOBAGE_URL, '_blank')
      break
    default:
      break
  }
}

export const openOrCreateTab = (url: string, target: string) => {
  if (windowObjectReference == null || windowObjectReference.closed) {
    windowObjectReference = window.open(url, target)
  } else {
    windowObjectReference.focus()
  }
}
