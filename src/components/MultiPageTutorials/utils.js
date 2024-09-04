export const shouldShowNext = (activeTutorial, pageOptions) => {
  const hasNextTutorial = activeTutorial && activeTutorial.next;
  const hasPageOption = pageOptions?.['show-next-top'] === '';
  return hasPageOption && hasNextTutorial;
};
