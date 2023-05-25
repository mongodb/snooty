import { useState, useEffect } from 'react';
import { fetchOADiff } from '../../../utils/realm';
import useChangelogData from '../../../utils/use-changelog-data';
import { getDiffRequestFormat } from './getDiffRequestFormat';

export const useFetchDiff = (resourceVersionOne, resourceVersionTwo, setIsLoading) => {
  const { index = {}, mostRecentDiff = {} } = useChangelogData();
  const [diff, setDiff] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    if (!resourceVersionOne || !resourceVersionTwo || !index.runId) return;

    const fromAndToDiffLabel = getDiffRequestFormat(resourceVersionOne, resourceVersionTwo);
    const { mostRecentDiffLabel, mostRecentDiffData } = mostRecentDiff;

    if (mostRecentDiffLabel === fromAndToDiffLabel && Array.isArray(mostRecentDiffData)) {
      setDiff(mostRecentDiffData);
      setIsLoading(false);
    } else {
      fetchOADiff(index.runId, fromAndToDiffLabel)
        .then((response) => {
          setDiff(response);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setIsLoading(false);
        });
    }
  }, [resourceVersionOne, resourceVersionTwo, index, setIsLoading, mostRecentDiff]);

  return [diff, setDiff];
};
