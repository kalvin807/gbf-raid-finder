export const SUPPORTED_LOCALES = ['en', 'ja'] as const
export type SupportedLocale = typeof SUPPORTED_LOCALES[number]

export const DEFAULT_LOCALE: SupportedLocale = 'en'

export const LOCALE_LABEL: { [locale in SupportedLocale]: string } = {
  en: 'English',
  ja: '日本語',
}

export const API_URL = import.meta.env.PROD ? 'https://gbf-api.kalvin.io' : 'http://localhost:8080'
export const WS_URL = import.meta.env.PROD ? 'wss://gbf-api.kalvin.io/ws' : 'ws://localhost:8080/ws'
