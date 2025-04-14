/**
 * Tabs selectors are singular per page
 * For offline builds, refer to one ID from TabSelectors component
 *
 */

function bindTabsSelectorsUI() {
  function onChoiceClick({ e, choices, tabsComponents, menu, button }) {
    // get the data-value attribute from Select component
    const tabName = e.currentTarget.getAttribute('data-value');

    // set choice selected for styling css
    for (const choice of choices) {
      choice.setAttribute('selected', false);
    }
    e.currentTarget.setAttribute('selected', true);

    // handle the tabsComponents
    for (const tabsComponent of tabsComponents) {
      // find the tab within each tabsComponent
      // tabs are tied to data-tabid value
      // if it exists, hide all other tabs, and show this tab
      for (const tabPanel of tabsComponent.querySelectorAll('[role=tabpanel]')) {
        const tabElmWithSameId = tabPanel.querySelector(`[data-tabid=${CSS.escape(tabName)}]`);
        tabPanel.style.display = tabElmWithSameId ? 'block' : 'none';
      }
    }
    const buttonChildren = button.querySelectorAll('div');
    const selectTextelm = buttonChildren[buttonChildren.length - 1];
    selectTextelm.innerText = e.currentTarget.getAttribute('data-text');

    // finally hide the menu
    menu.setAttribute('hidden', true);
  }

  const onContentLoaded = () => {
    const selectPortal = document.querySelector('#offline-select');

    // bind menu opening to select component
    const button = selectPortal?.querySelector('button');
    const menu = selectPortal?.querySelector('.offline-select-menu');
    button?.addEventListener('click', () => {
      menu.toggleAttribute('hidden');
    });

    // bind choices selection to showing tabbed content
    const choices = menu?.querySelectorAll('.offline-select-choice') ?? [];
    const tabsComponents = document.querySelectorAll('.offline-tabs.drivers');
    for (const choice of choices) {
      choice?.addEventListener('click', (e) => {
        onChoiceClick({ e, choices, tabsComponents, menu, button });
      });
    }

    // select the first choice on load
    // TODO: possibly add to local storage and store info here
    choices[0].click();

    // bind document click to close menu
    document.addEventListener('click', (e) => {
      if (!selectPortal.contains(e.target)) {
        menu.setAttribute('hidden', true);
      }
    });
  };

  document.addEventListener('DOMContentLoaded', onContentLoaded, false);
}

export default bindTabsSelectorsUI;
