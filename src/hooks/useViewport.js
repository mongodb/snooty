import React from 'react';

export function getViewport() {
  const viewport = {
    width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
    scrollY: Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop || 0),
    scrollX: Math.max(window.pageXOffset, document.documentElement.scrollLeft, document.body.scrollLeft || 0),
  };
  return viewport;
}

export default function useViewport() {
  const [viewport, setViewport] = React.useState(getViewport());
  const onChange = () => {
    setViewport(getViewport());
  };
  React.useEffect(() => {
    window.addEventListener('resize', onChange);
    window.addEventListener('scroll', onChange);
    return () => {
      window.removeEventListener('resize', onChange);
      window.removeEventListener('scroll', onChange);
    };
  }, []);

  return viewport;
}
