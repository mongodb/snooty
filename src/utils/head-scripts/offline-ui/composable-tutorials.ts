function bindComposableTutorials() {
  function onSelectListItem(
    this: HTMLElement,
    contents: HTMLElement[],
    menu: HTMLElement,
    configurableOptions: HTMLElement[],
    composable: HTMLElement,
    // listItems: HTMLElement[],
    currentIdx: number,
    selectButton?: HTMLElement
  ) {
    const currentSelections: Record<string, string> = {};

    // loop through each configurable option
    // for the ones preceding the one clicked, get their values
    // for the ones following the one clicked, update their availability and value
    for (let idx = 0; idx < configurableOptions.length; idx++) {
      if (idx === currentIdx) {
        continue;
      }

      const configurableOption = configurableOptions[idx];
      const composableSelect = configurableOption.querySelector('button') as HTMLElement;

      if (idx < currentIdx) {
        const key = '';
        const value = '';
        currentSelections[key] = value;
        continue;
      }

      // hide this configurable option if dependencies not met
      let dependencies: Record<string, string>[] = [];
      try {
        dependencies = JSON.parse(composableSelect?.dataset['option'] ?? '[]');
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
        configurableOption.removeAttribute('hidden');
      } else {
        configurableOption.setAttribute('hidden', 'true');
      }
    }

    // update the current selection list
    const selectedOptionValue = this.dataset['value'];
    const configurableOptionValue = selectButton?.dataset['value'];
    if (configurableOptionValue && selectedOptionValue) {
      currentSelections[configurableOptionValue] = selectedOptionValue;
    }
    composable.dataset.selections = JSON.stringify(currentSelections);

    // update the availabilty of listItems within option

    // show the contents

    // update select button text
    const buttonChildren = selectButton?.querySelectorAll('div');
    const buttonText = buttonChildren ? buttonChildren[buttonChildren.length - 1] : undefined;
    if (selectButton && buttonText) {
      buttonText.innerText = this.innerText;
    }
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

        for (const listItem of listItems) {
          // const listItem = listItems[idx];
          listItem.addEventListener('click', () => {
            onSelectListItem.call(
              listItem,
              contents,
              menu,
              composableSelects,
              composable,
              // listItems,
              idx,
              selectButton ?? undefined
            );
          });
        }
      }
    }

    // select defaults
  };

  document.addEventListener('DOMContentLoaded', onContentLoaded, false);
}

export const OFFLINE_COMPOSABLE_CLASSNAME = 'offline-composable';
export const OFFLINE_MENU_CLASSNAME = 'offline-composable-select';

export default bindComposableTutorials;
