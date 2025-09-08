import { SearchPropertyMapping } from '../hooks/use-marian-manifests';

/**
 * Fetches SearchPropertyMapping
 * {
 *   [project: string]: {
 *     categoryTitle: string;
 *     versionSelectorLabel: string;
 *   };
 * }
 */
export const fetchSearchPropertyMapping = async (dbName: string): Promise<SearchPropertyMapping> => {
  const res = await fetch(`${process.env.GATSBY_NEXT_API_BASE_URL}/search-mapping?dbName=${dbName}`);
  return res.json();
};
