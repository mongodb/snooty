function bindIOCode() {
  // NOTE: cannot insert string variables here. inserting this as a stringified script
  const onContentLoaded = () => {
    const controlBtns = document.querySelectorAll('.io-control-btn');
    for (const controlBtn of controlBtns) {
      const outputElm = controlBtn.parentElement?.parentElement?.querySelector('.io-control-output');
      controlBtn.addEventListener('click', () => {
        // hide output
        outputElm.toggleAttribute('hidden');
        // toggle text
        controlBtn.classList.toggle('offline-hide-output');
      });
    }
  };

  document.addEventListener('DOMContentLoaded', onContentLoaded, false);
}

export function bindCodeCopy() {
  const onContentLoaded = () => {
    const codeComponents = document.querySelectorAll('.code-component-container');
    for (const codeComponent of codeComponents) {
      const copyBtn = codeComponent.querySelector('[aria-label="Copy"]');
      const content = codeComponent.innerText;
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
