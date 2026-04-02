import { isBrowser } from './is-browser';
import { stripLocale } from './locale';

export const getPageUrl = () => {
  if (isBrowser) return stripLocale(window.location.pathname);
  else return '';
};
