import 'server-only';

const dictionaries = {
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  id: () => import('@/dictionaries/id.json').then((module) => module.default),
};

export const getDictionary = async (locale: 'en' | 'id') => {
  if (dictionaries[locale]) {
    return dictionaries[locale]();
  }
  return dictionaries.en(); // default fallback
};
