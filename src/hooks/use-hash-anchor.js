import { useEffect } from 'react';
import { useLocation } from '@gatsbyjs/reach-router';

const useHashAnchor = (id, ref) => {
  const { hash } = useLocation();

  useEffect(() => {
    const hashId = hash?.slice(1);
    if (!hash || id !== hashId || !ref.current) {
      return;
    }
    setTimeout(() => {
      ref.current.scrollIntoView(true);
    }, 100);
  }, [hash, id, ref]);
};

export default useHashAnchor;
