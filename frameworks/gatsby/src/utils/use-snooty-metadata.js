import React from 'react';

const MetadataContext = React.createContext();

export default function useSnootyMetadata() {
  return React.useContext(MetadataContext);
}

export function MetadataProvider({ children, metadata }) {
  return <MetadataContext.Provider value={metadata}>{children}</MetadataContext.Provider>;
}
