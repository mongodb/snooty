import React from 'react';
import noScroll from 'no-scroll';

const useNoScroll = (condition) => {
  React.useEffect(() => {
    if (condition) {
      noScroll.on();
      return () => noScroll.off();
    }
  }, [condition]);
};

export default useNoScroll;
