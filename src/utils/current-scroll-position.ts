import { isBrowser } from './is-browser';

// Function that returns current scroll position for analytics
export const currentScrollPosition = (): number => {
  if (isBrowser) {
    return Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
  }
  return 0;
};
