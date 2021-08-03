interface Clipboard {
  writeText(text: string): Promise<void>
}

export async function copy(text: string) {
  const clipboard = navigator.clipboard as Clipboard
  try {
    await clipboard.writeText(text)
  } catch {
    fallbackCopy(text)
  }
}

function fallbackCopy(text: string) {
  const el = document.createElement('textarea')
  el.value = text
  el.setAttribute('readonly', '')
  el.style.position = 'absolute'
  el.style.left = '-9999px'
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
}
