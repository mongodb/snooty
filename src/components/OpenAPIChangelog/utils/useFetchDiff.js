import { useState, useEffect } from 'react';
import { fetchOADiff } from '../../../utils/realm';
import { getDiffRequestFormat } from './getDiffRequestFormat';

export const useFetchDiff = ({ resourceVersionOne, resourceVersionTwo, index }) => {
  const [diff, setDiff] = useState([]);

  useEffect(() => {
    if (!resourceVersionOne || !resourceVersionTwo || !index.runId) return;
    const fromAndToDiffString = getDiffRequestFormat(resourceVersionOne, resourceVersionTwo);

    fetchOADiff(index.runId, fromAndToDiffString)
      .then((response) => setDiff(response))
      .catch((err) => console.error(err));
  }, [resourceVersionOne, resourceVersionTwo, index.runId]);

  return [diff, setDiff];
};
