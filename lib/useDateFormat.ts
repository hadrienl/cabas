import { useTranslation } from './i18n';

export const useDateFormat = () => {
  const {
    i18next: { language: currentLang },
  } = useTranslation();
  return (
    date: number | Date | string,
    {
      language = currentLang,
      ...options
    }: Intl.DateTimeFormatOptions & { language?: string } = {}
  ) => Intl.DateTimeFormat(language, options).format(new Date(date));
};

export default useDateFormat;
