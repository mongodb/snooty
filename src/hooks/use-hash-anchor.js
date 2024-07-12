import { useEffect } from 'react';
import { useLocation } from '@gatsbyjs/reach-router';
import { theme } from '../theme/docsTheme';

const useHashAnchor = (id, ref) => {
  const { hash } = useLocation();

  useEffect(() => {
    const hashId = hash?.slice(1);
    if (!hash || id !== hashId || !ref.current || !window) {
      return;
    }
    setTimeout(() => {
      const scrollFromTop = ref.current.getBoundingClientRect()?.top + window.scrollY;
      if (!scrollFromTop || scrollFromTop < 0) {
        console.log('returning early for id ', hashId);
        return;
      }
      console.log('scrolling for ', hashId);
      window.scrollTo(0, scrollFromTop - parseInt(theme.header.navbarScrollOffset));
    }, 100);
  }, [hash, id, ref]);
};

export default useHashAnchor;
