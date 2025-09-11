import { MetadataDatabaseName } from '../types/data';

interface OASResponse {
  fileContent: string;
}
export const fetchOASFile = async (apiName: string, database: MetadataDatabaseName): Promise<OASResponse> => {
  const res = await fetch(
    `${process.env.GATSBY_NEXT_API_BASE_URL}/api/openapi/?apiName=${apiName}&database=${database}`
  );

  return res.json();
};
