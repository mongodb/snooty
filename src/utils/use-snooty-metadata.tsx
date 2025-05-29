import React, { ReactNode } from 'react';
import { RemoteMetadata } from '../types/data';

const MetadataContext = React.createContext<RemoteMetadata | undefined>(undefined);

export default function useSnootyMetadata() {
  const context = React.useContext(MetadataContext);
  if (!context) {
    throw new Error('useSnootyMetadata must be used within a MetadataProvider');
  }
  return context;
}

export function MetadataProvider({ children, metadata }: { children: ReactNode; metadata: RemoteMetadata }) {
  return <MetadataContext.Provider value={metadata}>{children}</MetadataContext.Provider>;
}
