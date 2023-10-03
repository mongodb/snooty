import { useState, useEffect } from 'react';
import { fetchOADiff } from '../../../utils/realm';
import useChangelogData from '../../../utils/use-changelog-data';
import { getDiffRequestFormat } from './getDiffRequestFormat';

//nested filtering of Diff changes with hideFromChangelog
const hideDiffChanges = (diffData) => {
  const pathUpdate = (path) => {
    const updatedPath = { ...path };
    if (path?.changes) {
      updatedPath.changes = path.changes.filter((change) => !change.hideFromChangelog);
    }
    return updatedPath;
  };

  const updatedDiffData = diffData.map(pathUpdate);
  return updatedDiffData.filter((path) => path?.changes?.length);
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
  }, [resourceVersionOne, resourceVersionTwo, index, mostRecentDiff, setIsLoading, setToastOpen, snootyEnv]);

  return [diff, setDiff];
};
