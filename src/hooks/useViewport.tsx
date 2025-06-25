import React from 'react';
import { isBrowser } from '../utils/is-browser';
import debounce from '../utils/debounce';

export type Viewport = {
  scrollY: number;
  scrollX: number;
  width?: number;
  height?: number;
};

export function getViewport(): Viewport {
  const viewport = isBrowser
    ? {
        width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
        height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
        scrollY: Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop || 0),
        scrollX: Math.max(window.pageXOffset, document.documentElement.scrollLeft, document.body.scrollLeft || 0),
      }
    : {
        scrollY: 0,
        scrollX: 0,
      };

  return viewport;
}

export default function useViewport(useDebounce = true) {
  const [viewport, setViewport] = React.useState(getViewport());
  const onChange = () => {
    setViewport(getViewport());
  };

  React.useEffect(() => {
    const fnOnChange = useDebounce ? debounce(onChange, 200) : onChange;
    window.addEventListener('resize', fnOnChange);
    window.addEventListener('scroll', fnOnChange);
    return () => {
      window.removeEventListener('resize', fnOnChange);
      window.removeEventListener('scroll', fnOnChange);
    };
  }, [useDebounce]);

  return viewport;
}
