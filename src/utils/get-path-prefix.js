import { useSiteMetadata } from '../hooks/use-site-metadata';

export const getPathPrefix = () => {
  const { branch, project, user } = useSiteMetadata();
  return process.env.NODE_ENV === 'production' ? `/${project}/${user}/${branch}` : '';
};
