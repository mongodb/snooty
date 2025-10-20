import { useEffect, useState } from 'react';
import { isBrowser } from '../utils/is-browser';

const parseCookies = () => window.document.cookie.split(';');

const getTargetedCookie = (cookies: string[]) => cookies.find((cookie) => cookie.trim().startsWith('originRequest='));

export const useOriginalReqURL = () => {
  const [originReqURL, setOriginalReqURL] = useState<string | null>(null);

  useEffect(() => {
    if (isBrowser) {
      const cookies = parseCookies();
      // the target is set in B2K
      const targetCookie = getTargetedCookie(cookies);
      const cookie = targetCookie?.split('=')[1];
      if (cookie) {
        setOriginalReqURL(cookie);
      }
    }
  }, []);

  return { originReqURL };
};
