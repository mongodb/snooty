function bindCollapsibleUI() {
  const onContentLoaded = () => {
    try {
      const collapsibleComponents = document.querySelectorAll('.offline-collapsible');
      for (const collapsible of collapsibleComponents) {
        // bind event to button
        const button = collapsible.querySelector('button');
        button?.addEventListener('click', () => {
          console.log('click');
          const newVal = button.getAttribute('aria-expanded') === 'false' ? true : false;
          button.setAttribute('aria-expanded', newVal);
          collapsible.setAttribute('aria-expanded', newVal);
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  document.addEventListener('DOMContentLoaded', onContentLoaded, false);
}

export default bindCollapsibleUI;

export const CLASSNAME = `offline-collapsible`;
export const CONTENT_CLASSNAME = `offline-collapsible-content`;
