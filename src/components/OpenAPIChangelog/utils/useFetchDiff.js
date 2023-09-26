import { useState, useEffect } from 'react';
import { fetchOADiff } from '../../../utils/realm';
import useChangelogData from '../../../utils/use-changelog-data';
import { getDiffRequestFormat } from './getDiffRequestFormat';

//filter hideFromChangelog in diff
const hideDiffChanges = (diffData) => {
  const pathUpdate = (path) => {
    if (path !== null && path.changes !== null) {
      path.changes = path.changes.filter((change) => !change.hideFromChangelog);
    }
    return path;
  };
  diffData = diffData.map(pathUpdate);
  return diffData.filter((path) => path !== null && path.changes !== null && path.changes.length !== 0);
};

export const useFetchDiff = (resourceVersionOne, resourceVersionTwo, setIsLoading, setToastOpen, snootyEnv) => {
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
      fetchOADiff(index.runId, fromAndToDiffLabel, snootyEnv)
        .then((response) => {
          setDiff(hideDiffChanges(response));
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setIsLoading(false);
          setToastOpen(true);
          setTimeout(() => setToastOpen(false), 5000);
        });
    }
  }, [resourceVersionOne, resourceVersionTwo, index, mostRecentDiff, setIsLoading, setToastOpen, snootyEnv]);

  return [diff, setDiff];
};
