import { formatText } from './format-text';
import { getNestedValue } from './get-nested-value';

export const getPageTitle = (slug, slugTitleMapping) => {
  const title = getNestedValue([slug], slugTitleMapping);
  return title ? formatText(title) : null;
};
