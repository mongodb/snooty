function bindComposableTutorials() {
  function updateSelectButtonText(selectButton: HTMLElement, text: string) {
    const buttonChildren = selectButton?.querySelectorAll('div');
    const buttonText = buttonChildren ? buttonChildren[buttonChildren.length - 1] : undefined;
    if (selectButton && buttonText) {
      buttonText.innerText = text;
    }
  }

  function autoSelectFirstOption(selectButton: HTMLElement): [string, string] {
    const configurableOption = selectButton.closest('.configurable-option');
    if (!configurableOption) {
      console.error('Auto selecting first option not found');
      return ['', ''];
    }
    // get the first option list item
    const optionListItems = configurableOption.querySelector('li.offline-select-choice') as HTMLElement;

    // close the menu
    const selectMenu = configurableOption.querySelector('.offline-composable-select') as HTMLElement;
    selectMenu.setAttribute('hidden', ' true');
    return optionListItems?.dataset?.['value'] && optionListItems?.dataset?.['text']
      ? [optionListItems?.dataset?.['value'], optionListItems?.dataset?.['text']]
      : ['', ''];
  }

  function onSelectListItem(
    this: HTMLElement,
    contents: HTMLElement[],
    menu: HTMLElement,
    configurableOptions: HTMLElement[],
    currentIdx: number,
    selectButton?: HTMLElement
  ) {
    const currentSelections: Record<string, string> = {};

    // update the current selection list
    const selectedOptionValue = this.dataset['value'];
    const configurableOptionValue = selectButton?.dataset['optionValue'];
    if (configurableOptionValue && selectedOptionValue) {
      currentSelections[configurableOptionValue] = selectedOptionValue;
    }

    // loop through each configurable option
    // for the ones preceding the one clicked, get their values
    // for the ones following the one clicked, update their availability and value
    for (let idx = 0; idx < configurableOptions.length; idx++) {
      const configurableOption = configurableOptions[idx];
      const currentSelectButton = configurableOption.querySelector('button') as HTMLElement;
      if (idx === currentIdx) {
        currentSelectButton.dataset['selectionValue'] = selectedOptionValue;
        continue;
      }

      if (idx < currentIdx) {
        const key = currentSelectButton.dataset['optionValue'] ?? '';
        const value = currentSelectButton.dataset['selectionValue'] ?? '';
        currentSelections[key] = value;
        continue;
      }

      // hide this configurable option if dependencies not met
      let dependencies: Record<string, string>[] = [];
      try {
        dependencies = JSON.parse(currentSelectButton?.dataset['dependencies'] ?? '[]');
      } catch (e) {
        console.error(e);
      }

      let dependencyMet = true;
      for (const dependency of dependencies) {
        for (const [key, value] of Object.entries(dependency)) {
          if (currentSelections[key] !== value) {
            dependencyMet = false;
            break;
          }
        }
      }

      if (dependencyMet) {
        const key = currentSelectButton.dataset['optionValue'] ?? '';
        let value = currentSelectButton.dataset['selectionValue'] ?? '';
        let text = currentSelectButton.innerText;
        if (!value) {
          [value, text] = autoSelectFirstOption(currentSelectButton);
        }
        updateSelectButtonText(currentSelectButton, text);
        currentSelections[key] = value;
        configurableOption.removeAttribute('hidden');
      } else {
        configurableOption.setAttribute('hidden', 'true');
      }
    }

    // show the contents
    for (const contentElm of contents) {
      const requiredSelections: Record<string, string> = JSON.parse(contentElm.dataset['selections'] ?? '{}');
      let requirementsMet = true;
      for (const [key, value] of Object.entries(requiredSelections)) {
        if (value === 'None') {
          continue;
        }
        if (currentSelections[key] !== value) {
          requirementsMet = false;
          break;
        }
      }

      if (requirementsMet) {
        contentElm.removeAttribute('hidden');
      } else {
        contentElm.setAttribute('hidden', 'true');
      }
    }

    // update select button text
    updateSelectButtonText(selectButton as HTMLElement, this.innerText);
    // close the menu
    menu.setAttribute('hidden', 'true');
  }

  function onMenuButtonClick(this: HTMLElement, menu?: HTMLElement) {
    // get the width of the button. and set width of menu to that button
    const width = this.clientWidth;
    menu?.toggleAttribute('hidden');
    if (menu) menu.style.width = `${width}px`;
  }

  const onContentLoaded = () => {
    const composables = document.querySelectorAll('.offline-composable') as unknown as HTMLElement[];
    for (const composable of composables) {
      const composableSelects = composable.querySelectorAll('.configurable-option') as unknown as HTMLElement[];
      const contents = composable.querySelectorAll('[data-selections]') as unknown as HTMLElement[];

      for (let idx = 0; idx < composableSelects.length; idx++) {
        const composableSelect = composableSelects[idx];
        const selectButton = composableSelect.querySelector('button');
        const menu = composableSelect.querySelector('.offline-composable-select') as HTMLElement;

        // bind the select to show the menu
        selectButton?.addEventListener('click', () => {
          onMenuButtonClick.call(selectButton, menu ?? undefined);
        });

        const listItems = menu?.querySelectorAll('li') as unknown as HTMLElement[];

        // for (const listItem of listItems) {
        for (let listItemIdx = 0; listItemIdx < listItems.length; listItemIdx++) {
          const listItem = listItems[listItemIdx];
          listItem.addEventListener('click', () => {
            onSelectListItem.call(listItem, contents, menu, composableSelects, idx, selectButton ?? undefined);
          });
          if (idx === 0 && listItemIdx === 0) {
            listItem.click();
          }
        }
      }
    }
  };

  document.addEventListener('DOMContentLoaded', onContentLoaded, false);
}

export const OFFLINE_COMPOSABLE_CLASSNAME = 'offline-composable';
export const OFFLINE_MENU_CLASSNAME = 'offline-composable-select';

export default bindComposableTutorials;
