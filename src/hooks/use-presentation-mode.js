import { useMemo } from 'react';
import queryString from 'query-string';
import { useLocation } from '@gatsbyjs/reach-router';

export const usePresentationMode = () => {
  const { search } = useLocation();
  const presentationResult = useMemo(() => {
    const { presentation } = queryString.parse(search);
    return presentation;
  }, [search]);

  return presentationResult;
};
