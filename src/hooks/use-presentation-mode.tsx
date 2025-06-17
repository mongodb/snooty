import { useMemo } from 'react';
import queryString from 'query-string';
import { useLocation } from '@gatsbyjs/reach-router';

export const usePresentationMode = () => {
  const { search } = useLocation();
  const presentationResult = useMemo(() => {
    const { presentation } = queryString.parse(search);
    if (Array.isArray(presentation)) return presentation[0];
    return presentation;
  }, [search]);

  return presentationResult;
};
