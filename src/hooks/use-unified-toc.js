import { useMemo } from 'react';
import { tocData } from '../../toc_data/toc';

export function useUnifiedToc() {
  return useMemo(() => {
    return tocData();
  }, []);
}
