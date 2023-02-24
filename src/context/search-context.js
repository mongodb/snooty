import React, { useEffect, useState } from 'react';

export const SearchContext = React.createContext({
  searchManifests: [],
});

export const SearchContextProvider = ({ children }) => {
  const [searchManifests, setSearchManifests] = useState([]);

  async function fetchSearchManifests() {
    const searchManifestUrl = 'https://docs-search-transport.mongodb.com/status';

    try {
      const fetchResult = await fetch(searchManifestUrl, { method: 'GET' });
      const manifestData = await fetchResult.json();
      setSearchManifests(manifestData.manifests);
    } catch (e) {
      console.error(`ERROR! Unable to fetch search manifest data ${e.message}`);
    }
  }

  useEffect(() => {
    fetchSearchManifests();
  }, []);

  return <SearchContext.Provider value={{ searchManifests }}>{children}</SearchContext.Provider>;
};
