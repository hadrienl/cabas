import i18next from 'i18next';
import { useMemo } from 'react';

import fr from '../public/locales/fr/translations.json';

export const DEBUG_ENABLED = !!process.env.NEXT_PUBLIC_DEBUG;

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
});

const t = (k: string) => k;

export const useTranslation = () => {
  const tFn = useMemo(() => (i18next.t ? i18next.t.bind(i18next) : t), []);
  return { t: tFn, i18next };
};

export default i18next;
