import NextI18Next from 'next-i18next';

const NextI18NextInstance = new NextI18Next({
  defaultLanguage: 'fr',
  defaultNS: 'translations',
  localePath: 'public/locales',
  localeSubpaths: {
    fr: '',
  },
  otherLanguages: ['fr'],
});

export const { appWithTranslation, useTranslation } = NextI18NextInstance;

export default NextI18NextInstance;
