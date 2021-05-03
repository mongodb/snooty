import React, { useEffect, useState } from 'react';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import { isBrowser } from '../utils/is-browser';
import { fetchProjectParents } from '../utils/realm';

const NavigationContext = React.createContext(null);

const NavigationProvider = ({ children, pageTitle }) => {
  const { database, project } = useSiteMetadata();
  const [parents, setParents] = useState([]);

  useEffect(() => {
    const fetchBreadcrumbData = async () => {
      try {
        const parents = await fetchProjectParents(database, project);
        setParents(parents);
      } catch (err) {
        console.error(err);
      }
    };
    if (isBrowser) {
      fetchBreadcrumbData();
    }
  }, [database, project]);

  return <NavigationContext.Provider value={{ pageTitle, parents }}>{children}</NavigationContext.Provider>;
};

export { NavigationContext, NavigationProvider };
