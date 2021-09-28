module.exports = {
  i18n: {
    locales: ['fr'],
    defaultLocale: 'fr',
  },
  images: {
    domains: ['eyrtkidmatwveqwbscre.supabase.in'],
  },
  redirects() {
    return [
      {
        source: '/destination',
        destination: '/',
        permanent: true,
      },
    ];
  },
};
