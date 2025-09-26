import { useState, useEffect } from 'react';
import useChangelogData from '../../../utils/use-changelog-data';
import { fetchOpenAPIChangelogDiff } from '../../../utils/data/openapi-changelog-diff';
import { getDiffRequestFormat } from './getDiffRequestFormat';
import { hideDiffChanges } from './filterHiddenChanges';

export const useFetchDiff = (resourceVersionOne, resourceVersionTwo, setIsLoading, setToastOpen, snootyEnv) => {
  const { mostRecentDiff = {} } = useChangelogData();
  const [diff, setDiff] = useState([]);

  useEffect(() => {
    if (!resourceVersionOne || !resourceVersionTwo) return;

    const fromAndToDiffLabel = getDiffRequestFormat(resourceVersionOne, resourceVersionTwo);
    const { mostRecentDiffLabel, mostRecentDiffData } = mostRecentDiff;

    if (mostRecentDiffLabel === fromAndToDiffLabel && Array.isArray(mostRecentDiffData)) {
      setDiff(mostRecentDiffData);
      setIsLoading(false);
    } else {
      setIsLoading(true);
      fetchOpenAPIChangelogDiff(fromAndToDiffLabel, snootyEnv)
        .then((response) => {
          const filteredDiff = hideDiffChanges(response);
          setDiff(filteredDiff);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setIsLoading(false);
          setToastOpen(true);
          setTimeout(() => setToastOpen(false), 5000);
        });
    }
  }, [resourceVersionOne, resourceVersionTwo, mostRecentDiff, setIsLoading, setToastOpen, snootyEnv]);

  return [diff, setDiff];
};
