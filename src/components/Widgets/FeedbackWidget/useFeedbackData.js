import { useSiteMetadata } from '../../../hooks/use-site-metadata';

export default function useFeedbackData({ slug, title, url, publishedBranches }) {
  const { project } = useSiteMetadata();
  const feedback_data = {
    slug,
    url,
    title,
    docs_property: project,
    docs_version: publishedBranches ? publishedBranches.version.published : null,
  };
  return feedback_data;
}
