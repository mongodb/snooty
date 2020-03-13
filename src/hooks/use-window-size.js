import React, { useState, useLayoutEffect } from 'react';
import { isBrowser } from '../utils/is-browser';

export const useWindowSize = () => {
  const isClient = isBrowser();

  const getSize = React.useCallback(() => {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined,
    };
  }, [isClient]);

  const [windowSize, setWindowSize] = useState(getSize);

  useLayoutEffect(() => {
    if (!isClient) {
      return false;
    }

    const handleResize = () => {
      setWindowSize(getSize());
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [getSize, isClient]);

  return windowSize;
};
