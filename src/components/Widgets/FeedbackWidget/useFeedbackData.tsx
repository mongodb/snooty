import useSnootyMetadata from '../../../utils/use-snooty-metadata';

export type UseFeedbackDataProps = {
  slug: string;
  title: string;
  url: string;
};

export default function useFeedbackData({ slug, title, url }: UseFeedbackDataProps) {
  const { project } = useSnootyMetadata();
  const feedback_data = {
    slug,
    url,
    title,
    docs_property: project,
  };
  return feedback_data;
}
