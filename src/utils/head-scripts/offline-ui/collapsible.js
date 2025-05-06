function bindCollapsibleUI() {
  const onContentLoaded = () => {
    try {
      const collapsibleComponents = document.querySelectorAll('.offline-collapsible');
      for (const collapsible of collapsibleComponents) {
        // bind event to button
        const button = collapsible.querySelector('button');
        button?.addEventListener('click', () => {
          const newVal = button.getAttribute('aria-expanded') === 'false';
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

export const OFFLINE_COLLAPSIBLE_CLASSNAME = `offline-collapsible`;
