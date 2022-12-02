export interface ILanguageOption {
  text: string,
  value: string,
  matcher: RegExp,
  icon: string,
}

export const LANGUAGE = {
  en: 'en'
}

export const LanguageOptions: ILanguageOption[] = [{
  text: 'English',
  value: LANGUAGE.en,
  matcher: /en/i,
  icon: 'en'
}]
