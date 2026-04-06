import { isBrowser } from './is-browser';
import { stripLocale } from './locale';

export const getPagePath = () => {
  if (isBrowser) {
    const withoutLocale = stripLocale(window.location.pathname);
    if (withoutLocale.startsWith('/docs')) {
      return withoutLocale.slice(5);
    }
    return withoutLocale;
  } else return '';
};
