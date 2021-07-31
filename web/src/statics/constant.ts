export const SUPPORTED_LOCALES = ['en-US', 'ja-JP', 'zh-TW'] as const
export type SupportedLocale = typeof SUPPORTED_LOCALES[number]

export const DEFAULT_LOCALE: SupportedLocale = 'en-US'

export const LOCALE_LABEL: { [locale in SupportedLocale]: string } = {
  'en-US': 'English',
  'ja-JP': '日本語',
  'zh-TW': '中文',
}
