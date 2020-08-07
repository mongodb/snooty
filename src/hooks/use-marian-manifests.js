import React, { useEffect, useState } from 'react';
import { parseMarianManifests } from '../utils/parse-marian-manifests';

// TODO: remove when Marian change is in prod
const PARSED_MANIFESTS = {
  Atlas: { master: 'atlas-master' },
  'Atlas Open Service Broker': { current: 'atlas-open-service-broker-current' },
  Charts: {
    '19.06': 'charts-19.06',
    '19.09': 'charts-19.09',
    '19.12': 'charts-19.12',
    current: 'charts-current',
    master: 'charts-master',
    'v0.10': 'charts-v0.10',
    'v0.11': 'charts-v0.11',
    'v0.12': 'charts-v0.12',
    'v0.9': 'charts-v0.9',
  },
};

export const useMarianManifests = () => {
  const [filters, setFilters] = useState({});

  useEffect(() => {
    async function fetchManifests() {
      // TODO: Fix when Marian change is in production
      // const result = await fetch('http://marian.mongodb.com/status');
      // const jsonResult = await result.json();
      // setFilters(parseMarianManifests(jsonResult.manifests));
      setFilters(PARSED_MANIFESTS);
    }
    fetchManifests();
  }, []);

  return { filters };
};
