import { useEffect } from 'react';
import { useLocation } from '@gatsbyjs/reach-router';

const useHashAnchor = (id, ref) => {
  const { hash } = useLocation();

  useEffect(() => {
    const hashId = hash?.slice(1);
    if (!hash || id !== hashId) {
      return;
    }
    setTimeout(() => {
      console.log('scrolling');
      window.scrollTo(0, ref.current.offsetTop);
    }, 40);
  }, [hash, id, ref]);
};

export default useHashAnchor;
