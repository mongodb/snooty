/**
 * For offline HTML builds, snooty tab components
 * require additional DOM event binding to show/hide the content.
 *
 */

function bindTabUI() {
  /**
   * Get all the tab panels (div [role=tabpanel]) within given snooty tab component
   * Filters by the tab ids that are tied to the snooty tab (for handling nested tabs)
   * @param   {Element}   snootyTab
   * @returns {Element[]}
   */
  function getTabPanels(snootyTab) {
    // get the tab ids required from the snooty tab
    const tabIds = (snootyTab.dataset.tabids ?? '').split('/');
    const tabPanelsContainer = snootyTab.querySelector(`[class*="lg-ui-tab-panels"]`);

    const res = [];
    // get the tab content divs by tab ids
    // return list of content divs' parent elms
    for (const tabId of tabIds) {
      const tabContentElm = tabPanelsContainer?.querySelector(`[data-tabid=${CSS.escape(tabId)}]`);
      if (tabContentElm?.parentElement?.getAttribute('role') === 'tabpanel') {
        res.push(tabContentElm.parentElement);
      }
    }
    return res;
  }

  /**
   * Returns all the buttons associated with this snooty tab.
   * Uses the tab ids associated with this tab
   *
   * @param   {Element}   snootyTab
   * @returns {Element[]}
   */
  function getTabButtons(snootyTab) {
    // get first tab buttons list (vs nested tab buttons)
    const tabList = snootyTab.querySelector(`[class*="lg-ui-tab-list"]`);
    const tabIds = (snootyTab.dataset.tabids ?? '').split('/');
    return tabList
      ? Array.from(tabList.children).filter(
          (elm) => elm.getAttribute('role') === 'tab' && tabIds.includes(elm.dataset.tabid)
        )
      : [];
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

      // activate the tab panels
      const tabPanels = getTabPanels(snootyTab);
      for (const tabPanel of tabPanels) {
        const tabElmWithSameId = tabPanel.querySelector(`[data-tabid=${CSS.escape(selectedTabId)}]`);
        tabPanel.style.display = tabElmWithSameId ? 'block' : 'none';
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
