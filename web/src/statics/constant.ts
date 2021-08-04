export const SUPPORTED_LOCALES = ['en', 'ja', 'zh'] as const
export type SupportedLocale = typeof SUPPORTED_LOCALES[number]

export const DEFAULT_LOCALE: SupportedLocale = 'en'

export const LOCALE_LABEL: { [locale in SupportedLocale]: string } = {
  en: 'English',
  ja: '日本語',
  zh: '中文',
}
