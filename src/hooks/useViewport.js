import React from 'react';
import debounce from 'lodash.debounce';
import { isBrowser } from '../utils/is-browser';

export function getViewport() {
  const viewport = isBrowser()
    ? {
        width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
        height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
        scrollY: Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop || 0),
        scrollX: Math.max(window.pageXOffset, document.documentElement.scrollLeft, document.body.scrollLeft || 0),
      }
    : {};
  return viewport;
}

export default function useViewport() {
  const [viewport, setViewport] = React.useState(getViewport());
  const onChange = () => {
    setViewport(getViewport());
  };

  React.useEffect(() => {
    // const debouncedOnChange = debounce(onChange, 200);
    const debouncedOnChange = onChange;
    window.addEventListener('resize', debouncedOnChange);
    window.addEventListener('scroll', debouncedOnChange);
    return () => {
      window.removeEventListener('resize', debouncedOnChange);
      window.removeEventListener('scroll', debouncedOnChange);
    };
  }, []);

  return viewport;
}
