import { isAfter } from 'date-fns';

export const getDiffRequestFormat = (resourceVersionOne, resourceVersionTwo) => {
  const resourceVersionChoices = [resourceVersionOne, resourceVersionTwo].sort((a, b) =>
    isAfter(new Date(b.split('-').join('/')), new Date(a.split('-').join('/'))) ? -1 : 1
  );
  return resourceVersionChoices.join('_');
};
