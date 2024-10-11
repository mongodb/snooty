/**
 * For offline HTML builds, snooty tab components
 * require additional DOM event binding to show/hide the content.
 *
 */

function bindTabUI() {
  const onContentLoaded = () => {
    // process all snooty tab components
    // find all leafy tabs
    const snootyTabComponents = document.querySelectorAll('.offline-tabs');
    for (const snootyTab of snootyTabComponents) {
      const tabId = (snootyTab.className.match(/tabs-id-\S+/)?.[0] ?? '').replace('tabs-id-', '');
      const tabPanels = document.querySelectorAll(`.tabs-id-${tabId} > .lg-ui-tab-panels-0000 > div > [role=tabpanel]`);
      // adds an event listener to each tab button of snooty tab component to show the
      // corresponding tab panel of the same index
      const tabButtons = snootyTab.querySelectorAll(
        `.tabs-id-${tabId} > #tabs-undefined .lg-ui-tab-list-0000 > [role=tab]`
      );
      tabButtons.forEach((tabButton, tabButtonIdx) => {
        tabButton.addEventListener('click', () => {
          tabPanels.forEach((tabPanelDom, tabPanelIdx) => {
            tabPanelDom.style.display = tabButtonIdx === tabPanelIdx ? 'block' : 'none';
          });
        });
      });
    }
  };

  // TODO: account for multiple browsers here. Which are we supporting? verify with PD
  document.addEventListener('DOMContentLoaded', onContentLoaded, false);
}

export default bindTabUI;
