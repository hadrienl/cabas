import { useTranslation } from './i18n';

export const useNumberFormat = () => {
  const {
    i18next: { language: currentLang },
  } = useTranslation();
  return (
    nbr: number | string,
    {
      language = currentLang,
      ...options
    }: Intl.NumberFormatOptions & { language?: string } = {}
  ) => Intl.NumberFormat(language, options).format(+nbr);
};

export default useNumberFormat;
