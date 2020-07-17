import { useEffect, useState } from 'react';

// from https://github.com/streamich/react-use/blob/master/src/useMedia.ts

const isClient = typeof window === 'object';

const useMedia = (query, defaultState = false) => {
  const [state, setState] = useState(defaultState);

  useEffect(() => {
    if (isClient) {
      let mounted = true;
      const mql = window.matchMedia(query);
      const onChange = () => {
        if (!mounted) {
          return;
        }
        setState(!!mql.matches);
      };

      mql.addListener(onChange);
      setState(mql.matches);

      return () => {
        mounted = false;
        mql.removeListener(onChange);
      };
    }
  }, [query]);

  return state;
};

export default useMedia;
