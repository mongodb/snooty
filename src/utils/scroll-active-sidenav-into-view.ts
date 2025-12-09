/**
 * Scrolls the active sidenav item into view.
 * Works for both Double Panned Nav (desktop) and Accordion Nav (mobile).
 */
export const scrollActiveSidenavIntoView = () => {
  const navDoublePannedContainer = document.querySelector('nav[aria-label*="Double Panned Side navigation Panel"]');

  if (navDoublePannedContainer && (navDoublePannedContainer as HTMLElement).offsetWidth > 0) {
    console.log('bianca navDoublePannedContainer meow', navDoublePannedContainer);
    // Double Panned Nav is visible
    const selectedDoublePannedLink = document.querySelector(
      '[aria-label*="Double Panned Side navigation Panel"] a[aria-current="page"]'
    );
    if (selectedDoublePannedLink) {
      selectedDoublePannedLink.scrollIntoView({
        block: 'center',
        behavior: 'instant',
      });
    }
  } else {
    // Accordion Nav is visible
    const selectedAccordionLink = document.querySelector(
      '[aria-label*="Accordion Side navigation Panel"] a[aria-current="page"]'
    );
    if (selectedAccordionLink) {
      selectedAccordionLink.scrollIntoView({
        block: 'center',
        behavior: 'instant',
      });
    }
  }
};
