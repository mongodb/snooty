import React, { useEffect, useState } from 'react';
import { SNOOTY_STITCH_ID } from '../build-constants';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import { fetchProjectParents } from '../utils/stitch';

const NavigationContext = React.createContext(null);

const NavigationProvider = ({ children }) => {
  const { database, project } = useSiteMetadata();
  const [parents, setParents] = useState([]);

  useEffect(() => {
    const fetchBreadcrumbData = async () => {
      const parents = await fetchProjectParents(SNOOTY_STITCH_ID, database, project);
      setParents(parents);
    };
    fetchBreadcrumbData();
  }, [database, project]);

  return <NavigationContext.Provider value={{ parents }}>{children}</NavigationContext.Provider>;
};

export { NavigationContext, NavigationProvider };
