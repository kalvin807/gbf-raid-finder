export const SUPPORTED_LOCALES = ['en', 'ja', 'zh']
export type SupportedLocale = typeof SUPPORTED_LOCALES[number]

export const DEFAULT_LOCALE: SupportedLocale = 'en'

export const LOCALE_LABEL: { [locale in SupportedLocale]: string } = {
  en: 'English',
  ja: '日本語',
  zh: '中文',
}

export const API_URL = import.meta.env.PROD ? 'https://gbf-api1.kalvin.io' : 'http://localhost:8080'
export const WS_URL = import.meta.env.PROD ? 'wss://gbf-api1.kalvin.io/ws' : 'ws://localhost:8080/ws'
export const GBF_URL = 'http://game.granbluefantasy.jp/#quest/assist'
export const GBF_NAME = 'グランブルーファンタジー'
export const MOBAGE_URL = 'mobage-jp-12016007://'
export const SKYLEAP_URL = 'skyleap://'
