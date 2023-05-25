import { useState, useEffect } from 'react';
import { fetchOADiff } from '../../../utils/realm';
import { getDiffRequestFormat } from './getDiffRequestFormat';

export const useFetchDiff = (resourceVersionOne, resourceVersionTwo, index, setIsLoading) => {
  const [diff, setDiff] = useState([]);

  useEffect(() => {
    if (!resourceVersionOne || !resourceVersionTwo || !index.runId) return;
    setIsLoading(true);
    const fromAndToDiffString = getDiffRequestFormat(resourceVersionOne, resourceVersionTwo);

    fetchOADiff(index.runId, fromAndToDiffString)
      .then((response) => {
        setDiff(response);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, [resourceVersionOne, resourceVersionTwo, index.runId, setIsLoading]);

  return [diff, setDiff];
};
