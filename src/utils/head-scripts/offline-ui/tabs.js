/**
 * For offline HTML builds, snooty tab components
 * require additional DOM event binding to show/hide the content.
 *
 */

function bindTabUI() {
  const onContentLoaded = () => {
    try {
      // process all snooty tab components
      const snootyTabComponents = document.querySelectorAll(`.offline-tabs`);
      for (const snootyTab of snootyTabComponents) {
        const tabId = snootyTab['id'];
        const tabPanels = document.querySelectorAll(`#${tabId} > .lg-ui-tab-panels-0000 > div > [role=tabpanel]`);
        if (tabPanels.length) {
          tabPanels[0].style.display = 'block';
        }
        // adds an event listener to each tab button of snooty tab component to show the
        // corresponding tab panel of the same index
        const tabButtons = snootyTab.querySelectorAll(
          `#${tabId} > #${tabId}-undefined .lg-ui-tab-list-0000 > [role=tab]`
        );
        if (tabButtons.length) {
          tabButtons[0].setAttribute('aria-selected', true);
        }
        tabButtons.forEach((tabButton, tabButtonIdx) => {
          tabButton.addEventListener('click', () => {
            tabPanels.forEach((tabPanelDom, tabPanelIdx) => {
              tabPanelDom.style.display = tabButtonIdx === tabPanelIdx ? 'block' : 'none';
            });
            tabButtons.forEach((tb, tbIdx) => {
              tb.setAttribute('aria-selected', tbIdx === tabButtonIdx ? true : false);
            });
          });
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  // TODO: account for multiple browsers here. Which are we supporting? verify with PD
  document.addEventListener('DOMContentLoaded', onContentLoaded, false);
}

export default bindTabUI;

// return an id to get for tabs
// replace all non letter/number characters with dash
export function getOfflineId(tabsetName) {
  return tabsetName.replace(/[^a-zA-Z0-9]/g, '-');
}

export const TABS_CLASSNAME = `offline-tabs`;
