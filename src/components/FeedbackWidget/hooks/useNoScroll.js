import React from 'react';
import noScroll from 'no-scroll';

export default function useNoScroll(condition) {
  React.useEffect(() => {
    if (condition) {
      noScroll.on();
      return () => noScroll.off();
    }
  }, [condition]);
}
