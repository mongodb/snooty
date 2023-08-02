import React, { useEffect, useState } from 'react';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import { isBrowser } from '../utils/is-browser';
import { fetchProjectParents } from '../utils/realm';
import useSnootyMetadata from '../utils/use-snooty-metadata';

const NavigationContext = React.createContext({
  parents: [],
  completedFetch: false,
});

const NavigationProvider = ({ children }) => {
  const { database } = useSiteMetadata();
  const { project } = useSnootyMetadata();
  const [parents, setParents] = useState([]);
  const [completedFetch, setCompletedFetch] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const parents = await fetchProjectParents(database, project);
        setParents(parents);
      } catch (err) {
        console.error(err);
      }
    };
    if (isBrowser) {
      fetchData().then(() => {
        setCompletedFetch(true);
      });
    }
  }, [database, project]);

  return <NavigationContext.Provider value={{ completedFetch, parents }}>{children}</NavigationContext.Provider>;
};

export { NavigationContext, NavigationProvider };
