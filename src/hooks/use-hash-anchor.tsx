import { MutableRefObject, useContext, useEffect, useState } from 'react';
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
  const { selectors, setInitialTabs, setLanguageSelectorTab } = useContext(TabContext);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    if (!initialLoad || !hash || hasScrolled) return;
    setInitialLoad(false);

    const hashId = hash?.slice(1);
    if (id !== hashId || !ref.current) {
      return;
    }

    if (setActiveTabToHashTab) {
      // If within tab, force correct tabs to be open
      setLanguageSelectorTab();
      setActiveTabToHashTab();
    } else {
      // Otherwise, ensure default and local storage-found tabs are selected
      setInitialTabs();
    }

    const element = ref.current;
    const startTime = Date.now();
    const timeout = 5000;

    const checkAndScroll = () => {
      if (!element) return;

      if (element.scrollHeight > 0) {
        const y = element.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: y });
        setHasScrolled(true);
        return;
      }

      if (Date.now() - startTime < timeout) {
        requestAnimationFrame(checkAndScroll);
      }
    };

    checkAndScroll();
  }, [hash, id, ref, selectors, hasScrolled, initialLoad, setActiveTabToHashTab, setInitialTabs, setLanguageSelectorTab]);
};

export default useHashAnchor;
