import i18next from 'i18next';

import fr from '../public/locales/fr/translations.json';

export const DEBUG_ENABLED = !!process.env.NEXT_PUBLIC_DEBUG;

i18next.init({
  lng: 'fr',
  supportedLngs: ['fr'],
  debug: DEBUG_ENABLED,
  resources: {
    fr: {
      translation: fr,
    },
  },
});

const t = (k: string) => k;

export const useTranslation = () => {
  return { t: i18next.t ? i18next.t.bind(i18next) : t, i18next };
};

export default i18next;
