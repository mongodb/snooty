import { MutableRefObject, useContext, useEffect } from 'react';
import { useLocation } from '@gatsbyjs/reach-router';

import { TabHashContext } from '../components/Tabs/tab-hash-context';
import { TabContext } from '../components/Tabs/tab-context';

// Hook that scrolls the current ref element into view
// if it is the same as the current location's hash.
// This is required on elements with id attribute
// to overcome DOM tree being pushed down by rehydrated content
// ie. saved tabbed content from local storage
const useHashAnchor = (id: string, ref: MutableRefObject<HTMLElement>) => {
  const { hash } = useLocation();
  const { setActiveTabToHashTab } = useContext(TabHashContext);
  const { selectors } = useContext(TabContext);

  useEffect(() => {
    const hashId = hash?.slice(1);
    if (!hash || id !== hashId || !ref.current) {
      return;
    }

    if (setActiveTabToHashTab) {
      setActiveTabToHashTab();
    }

    const delay = Object.keys(selectors).includes('drivers') ? 1500 : 100;

    setTimeout(() => {
      ref.current.scrollIntoView();
    }, delay);
  }, [hash, id, ref, selectors, setActiveTabToHashTab]);
};

export default useHashAnchor;
