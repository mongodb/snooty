import { useState, useEffect } from 'react';
import { fetchOADiff } from '../../../utils/realm';
import useChangelogData from '../../../utils/use-changelog-data';
import { getDiffRequestFormat } from './getDiffRequestFormat';

export const useFetchDiff = (resourceVersionOne, resourceVersionTwo) => {
  const { index = {}, mostRecentDiff = {} } = useChangelogData();
  const [diff, setDiff] = useState([]);

  useEffect(() => {
    if (!resourceVersionOne || !resourceVersionTwo || !index.runId) return;

    const fromAndToDiffLabel = getDiffRequestFormat(resourceVersionOne, resourceVersionTwo);
    const { mostRecentDiffData, mostRecentDiffLabel } = mostRecentDiff;

    if (mostRecentDiffLabel === fromAndToDiffLabel && Array.isArray(mostRecentDiffData)) {
      setDiff(mostRecentDiffData);
    } else {
      fetchOADiff(index.runId, fromAndToDiffLabel)
        .then((response) => setDiff(response))
        .catch((err) => console.error(err));
    }
  }, [resourceVersionOne, resourceVersionTwo, index, mostRecentDiff]);

  return [diff, setDiff];
};
