import { OpenAPIChangelogDiffSection, SnootyEnv } from '../types/data';

export const fetchOpenAPIChangelogDiff = async (
  diffString: string,
  snootyEnv: SnootyEnv
): Promise<OpenAPIChangelogDiffSection[]> => {
  const isStaging = ['staging', 'development', 'dotcomstg'].includes(snootyEnv);
  const res = await fetch(
    `${process.env.GATSBY_NEXT_API_BASE_URL}/openapi/diff/?diff=${diffString}${isStaging ? `&staging=true` : ''}`
  );
  return res.json();
};
