function bindMethodSelectorUI() {
  const onContentLoaded = () => {
    try {
      // find all method selectors
      const methodSelectorComponents = document.querySelectorAll('.offline-method-selector');
      for (const methodSelectorComponent of methodSelectorComponents) {
        // find the button group role=group
        const buttonGroup = methodSelectorComponent.querySelector('[role=group]');

        // find the radio box inputs within button group and bind action
        const buttons = buttonGroup?.querySelectorAll('input') ?? [];

        // find all the content within method selectors
        const contentDivs =
          methodSelectorComponent.parentElement?.querySelectorAll('.offline-method-selector-content') ?? [];

        // find all the labels to style for selected
        const labels = methodSelectorComponent.querySelectorAll('label');

        // for each input, find value `{name}-{index}` ie.  `driver-0`
        // find content div with data-testid=[method-option-content-{name}] and show that content div
        for (let idx = 0; idx < buttons.length; idx++) {
          const button = buttons[idx];
          button.addEventListener('click', (e) => {
            const id = (e.currentTarget.getAttribute('value') || '').split('-')[0];
            const targetTestId = 'method-option-content-' + id;
            const parentLabel = button.parentElement;
            for (const contentDiv of contentDivs) {
              contentDiv.setAttribute('aria-expanded', targetTestId === contentDiv.getAttribute('data-testid'));
            }
            for (const label of labels) {
              label.setAttribute('aria-selected', label.isSameNode(parentLabel));
            }
          });
        }

        // on load, set first label as active
        labels[0]?.setAttribute('aria-selected', true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  document.addEventListener('DOMContentLoaded', onContentLoaded, false);
}

export default bindMethodSelectorUI;

export const OFFLINE_METHOD_SELECTOR_CLASSNAME = `offline-method-selector`;
export const OFFLINE_CONTENT_CLASSNAME = `offline-method-selector-content`;
