import React, { useState, useLayoutEffect } from 'react';
import { isBrowser } from '../utils/is-browser';

export const useWindowSize = () => {
  const getSize = React.useCallback(() => {
    return {
      width: isBrowser ? window.innerWidth : undefined,
      height: isBrowser ? window.innerHeight : undefined,
    };
  }, []);

  const [windowSize, setWindowSize] = useState(getSize);

  useLayoutEffect(() => {
    if (!isBrowser) {
      return false;
    }

    const handleResize = () => {
      setWindowSize(getSize());
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [getSize]);

  return windowSize;
};
