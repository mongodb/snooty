/**
 * For offline HTML builds, snooty tab components
 * require additional DOM event binding to show/hide the content.
 *
 */

function bindTabUI() {
  function getTabPanels(snootyTab) {
    return snootyTab.querySelectorAll(`.lg-ui-tab-panels-0000 > div > [role=tabpanel]`);
  }

  function getTabButtons(snootyTab) {
    return snootyTab.querySelectorAll(`.lg-ui-tab-list-0000 > [role=tab]`);
  }

  function handleButtonClick(tabButton, parentSnootyTab) {
    // find snooty tabs with matching class
    const tabsetsName = parentSnootyTab.dataset.tabids;
    const selectedTabId = tabButton.dataset.tabid;
    const snootyTabsWithSameTabSets = document.querySelectorAll(`[data-tabids=${CSS.escape(tabsetsName)}]`);

    for (const snootyTab of snootyTabsWithSameTabSets) {
      // activate the buttons
      const tabButtons = getTabButtons(snootyTab);
      for (const tabButton of tabButtons) {
        tabButton.setAttribute('aria-selected', tabButton.dataset.tabid === selectedTabId);
      }

      // activte the tab panels
      const tabPanels = getTabPanels(snootyTab);
      for (const tabPanel of tabPanels) {
        const tabId = tabPanel.querySelector(`[data-tabid=${CSS.escape(selectedTabId)}]`);
        tabPanel.style.display = tabId === selectedTabId;
      }
    }
  }
  const onContentLoaded = () => {
    try {
      // process all snooty tab components
      const snootyTabComponents = document.querySelectorAll(`.offline-tabs`);
      for (const snootyTab of snootyTabComponents) {
        const tabPanels = getTabPanels(snootyTab);

        // set the first tab as visible
        if (tabPanels.length) {
          tabPanels[0].style.display = 'block';
        }

        const tabButtons = getTabButtons(snootyTab);
        // set the first button as selected
        if (tabButtons.length) {
          tabButtons[0].setAttribute('aria-selected', true);
        }
        // adds an event listener to each tab button of snooty tab component across the page
        tabButtons.forEach((tabButton) => {
          tabButton.addEventListener('click', () => handleButtonClick(tabButton, snootyTab));
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  document.addEventListener('DOMContentLoaded', onContentLoaded, false);
}

export default bindTabUI;

export const TABS_CLASSNAME = `offline-tabs`;
