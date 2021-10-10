import i18next, { FormatFunction } from 'i18next';
import { useMemo } from 'react';

import fr from '../public/locales/fr/translations.json';

export const DEBUG_ENABLED = !!process.env.NEXT_PUBLIC_DEBUG;

const format: FormatFunction = (value, format, lang) => {
  if (value instanceof Date || !isNaN(+new Date(value))) {
    return Intl.DateTimeFormat(lang, {
      dateStyle: (format as Intl.DateTimeFormatOptions['dateStyle']) || 'long',
    }).format(new Date(value));
  }
  return `${value}`;
};

i18next.init({
  lng: 'fr',
  fallbackLng: 'fr',
  supportedLngs: ['fr'],
  //debug: DEBUG_ENABLED,
  resources: {
    fr: {
      translation: fr,
    },
  },
  interpolation: {
    format,
  },
});

const t = (k: string) => k;

export const useTranslation = () => {
  const tFn = useMemo(() => (i18next.t ? i18next.t.bind(i18next) : t), []);
  return { t: tFn, i18next };
};

export default i18next;
