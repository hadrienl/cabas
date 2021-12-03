import i18next, { FormatFunction } from 'i18next';
import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import datefnsFr from 'date-fns/locale/fr';

import fr from '../public/locales/fr/translations.json';

export const DEBUG_ENABLED = !!process.env.NEXT_PUBLIC_DEBUG;

const formatInterpolation: FormatFunction = (value, formatting = '', lang) => {
  if (!value) return '';
  const [formatFn, options = ''] = formatting.split(',');
  switch (formatFn) {
    case 'formatDate':
      return format(value instanceof Date ? value : parseISO(value), options, {
        locale: datefnsFr,
      });
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
    format: formatInterpolation,
  },
});

const t = (k: string) => k;

export const useTranslation = () => {
  const tFn = useMemo(() => (i18next.t ? i18next.t.bind(i18next) : t), []);
  return { t: tFn, i18next };
};

export default i18next;
