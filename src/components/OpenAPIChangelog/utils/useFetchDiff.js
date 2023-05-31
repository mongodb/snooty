import { useState, useEffect } from 'react';
import { fetchOADiff } from '../../../utils/realm';
import useChangelogData from '../../../utils/use-changelog-data';
import { getDiffRequestFormat } from './getDiffRequestFormat';

export const useFetchDiff = (resourceVersionOne, resourceVersionTwo, setIsLoading, setToastOpen) => {
  const { index = {}, mostRecentDiff = {} } = useChangelogData();
  const [diff, setDiff] = useState([]);

  useEffect(() => {
    if (!resourceVersionOne || !resourceVersionTwo || !index.runId) return;

    const fromAndToDiffLabel = getDiffRequestFormat(resourceVersionOne, resourceVersionTwo);
    const { mostRecentDiffLabel, mostRecentDiffData } = mostRecentDiff;

    if (mostRecentDiffLabel === fromAndToDiffLabel && Array.isArray(mostRecentDiffData)) {
      setDiff(mostRecentDiffData);
      setIsLoading(false);
    } else {
      setIsLoading(true);
      fetchOADiff(index.runId, fromAndToDiffLabel)
        .then((response) => {
          setDiff(response);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setIsLoading(false);
          setToastOpen(true);
          setTimeout(() => setToastOpen(false), 5000);
        });
    }
  }, [resourceVersionOne, resourceVersionTwo, index, mostRecentDiff, setIsLoading, setToastOpen]);

  return [diff, setDiff];
};
