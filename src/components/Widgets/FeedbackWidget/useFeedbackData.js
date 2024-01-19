import useSnootyMetadata from '../../../utils/use-snooty-metadata';

export default function useFeedbackData({ slug, title, url, publishedBranches }) {
  const { project } = useSnootyMetadata();
  const feedback_data = {
    slug,
    url,
    title,
    docs_property: project,
    docs_version: publishedBranches ? publishedBranches.version.published : null,
  };
  return feedback_data;
}
