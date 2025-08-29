import { Docset } from '../types/data';

// Fetches for Docsets (made separate for usage and creating mocks for testing components)
export const fetchDocset = async (dbName: string, project: string): Promise<Docset> => {
  const res = await fetch(`${process.env.GATSBY_NEXT_API_BASE_URL}/docsets/${project}?dbName=${dbName}`);
  return res.json();
};

export const fetchDocsets = async (dbName: string): Promise<Docset[]> => {
  const res = await fetch(`${process.env.GATSBY_NEXT_API_BASE_URL}/docsets?dbName=${dbName}`);
  return res.json();
};
