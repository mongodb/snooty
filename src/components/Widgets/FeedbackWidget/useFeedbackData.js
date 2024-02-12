import useSnootyMetadata from '../../../utils/use-snooty-metadata';

export default function useFeedbackData({ slug, title, url }) {
  const { project } = useSnootyMetadata();
  const feedback_data = {
    slug,
    url,
    title,
    docs_property: project,
  };
  return feedback_data;
}
