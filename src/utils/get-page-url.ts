import { isBrowser } from './is-browser';
import { stripLocale } from './locale';

export const getPageUrl = () => {
  console.log('window.location.pathname', window.location.pathname);
  console.log('isBrowser', isBrowser);
  if (isBrowser) return stripLocale(window.location.pathname);
  else return '';
};
