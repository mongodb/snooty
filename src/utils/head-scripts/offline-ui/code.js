function bindIOCode() {
  // NOTE: cannot insert string variables here. inserting this as a stringified script
  const onContentLoaded = () => {
    // find all IO-code control buttons
    const controlBtns = document.querySelectorAll('.io-control-btn');
    for (const controlBtn of controlBtns) {
      const outputElm = controlBtn.parentElement?.parentElement?.querySelector('.io-control-output');
      // on click of control button,
      // hide output
      // and toggle class for text+icon
      controlBtn.addEventListener('click', () => {
        outputElm.toggleAttribute('hidden');
        controlBtn.classList.toggle('offline-hide-output');
      });
    }
  };

  document.addEventListener('DOMContentLoaded', onContentLoaded, false);
}

export function bindCodeCopy() {
  const onContentLoaded = () => {
    // find all Code components
    const codeComponents = document.querySelectorAll('.code-component-container');
    for (const codeComponent of codeComponents) {
      const copyBtn = codeComponent.querySelector('[aria-label="Copy"]');
      const content = codeComponent.innerText;
      // on click of custom copy button, copy to user navigator clipboard
      copyBtn?.addEventListener('click', () => {
        navigator?.clipboard?.writeText(content);
      });
    }
  };

  document.addEventListener('DOMContentLoaded', onContentLoaded, false);
}

export default bindIOCode;

export const OFFLINE_CONTAINER_CLASSNAME = 'code-component-container';
export const OFFLINE_BUTTON_CLASSNAME = 'io-control-btn';
export const OFFLINE_OUTPUT_CLASSNAME = 'io-control-output';
