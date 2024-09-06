export const shouldShowNext = (activeTutorial, pageOptions) => {
  const hasNextTutorial = activeTutorial && activeTutorial.next;
  const hasPageOption = pageOptions?.['show-next-top'] === '';
  return hasPageOption && hasNextTutorial;
};

// export const getMPTPageOption = (pageOptions) => {
//   if (!pageOptions || Object.keys(pageOptions).length === 0) {
//     return;
//   }

//   const key = 'multi_page_tutorial_settings';
//   const mptOptions = pageOptions[key];

// };
