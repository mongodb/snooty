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
        console.log('buttons');
        console.log(buttons);

        // find all the content within method selectors
        const contentDivs =
          methodSelectorComponent.parentElement?.querySelectorAll('.offline-method-selector-content') ?? [];

        // for each input, find value `{name}-{index}` ie.  `driver-0`
        // find data-testid=[method-option-content-{name}] and show
        for (let idx = 0; idx < buttons.length; idx++) {
          const button = buttons[idx];
          button.addEventListener('click', (e) => {
            console.log('click');
            const id = (button.getAttribute('value') || '').split('-')[0];
            console.log('id ', id);
            const targetTestId = 'method-option-content-' + id;
            for (const contentDiv of contentDivs) {
              contentDiv.setAttribute('aria-expanded', targetTestId === contentDiv.getAttribute('data-testid'));
            }
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  document.addEventListener('DOMContentLoaded', onContentLoaded, false);
}

export default bindMethodSelectorUI;

export const OFFLINE_CLASSNAME = `offline-method-selector`;
export const OFFLINE_CONTENT_CLASSNAME = `offline-method-selector-content`;
