/**
 * For offline HTML builds, sidenav should adjust to scroll position
 * so that it is sticky, but takes up full height when scrolled down
 * and leaves room for Header Navigation at initial scrollY 0
 */

function updateSidenavHeight() {
  const updateScrollY = () => {
    // pulled from SIDE_NAV_CONTAINER_ID
    // 'docs-side-nav-container'
    const sidenavElm = document.querySelector('#docs-side-nav-container');
    sidenavElm.style = `--scroll-y: ${window.scrollY}px`;
    window.addEventListener('scroll', (e) => {
      sidenavElm.style = `--scroll-y: ${e.currentTarget.scrollY}px`;
    });
  };

  document.addEventListener('DOMContentLoaded', updateScrollY, false);
}

export default updateSidenavHeight;
