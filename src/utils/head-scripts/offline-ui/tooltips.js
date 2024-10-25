/**
 * For offline HTML builds, tooltips ...
 *
 */

function enableTooltipsOffline() {
  const enableHoverTooltips = () => {};
  // const updateScrollY = () => {
  //   // pulled from SIDE_NAV_CONTAINER_ID
  //   // 'docs-side-nav-container'
  //   const sidenavElm = document.querySelector('#docs-side-nav-container');
  //   sidenavElm.style = `--scroll-y: ${window.scrollY}px`;
  //   window.addEventListener('scroll', (e) => {
  //     sidenavElm.style = `--scroll-y: ${e.currentTarget.scrollY}px`;
  //   });
  // };

  document.addEventListener('DOMContentLoaded', enableHoverTooltips, false);
}

export default enableTooltipsOffline;
