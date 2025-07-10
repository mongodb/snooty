import { useMemo, useContext } from 'react';
import { UnifiedTocContext } from '../context/unified-toc-context';

export function useUnifiedToc() {
  const getTocData = () => unifiedToc || [];
  const { unifiedToc } = useContext(UnifiedTocContext);
  return useMemo(() => {
    return getTocData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
