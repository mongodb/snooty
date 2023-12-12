import { lazy, Suspense } from 'react';

const getTemplate = (templateName) => {
  let LazyTemplate;
  let sidenav;
  let useChatbot = false;
  switch (templateName) {
    case 'blank':
      LazyTemplate = lazy(() => import('../templates/blank'));
      break;
    case 'drivers-index':
      LazyTemplate = lazy(() => import('../templates/drivers-index'));
      sidenav = true;
      break;
    case 'errorpage':
      LazyTemplate = lazy(() => import('../templates/NotFound'));
      break;
    case 'instruqt':
      LazyTemplate = lazy(() => import('../templates/instruqt'));
      sidenav = true;
      break;
    case 'landing':
      LazyTemplate = lazy(() => import('../templates/landing'));
      sidenav = true;
      useChatbot = true;
      break;
    case 'openapi':
      LazyTemplate = lazy(() => import('../templates/openapi'));
      break;
    case 'changelog':
      LazyTemplate = lazy(() => import('../templates/changelog'));
      sidenav = true;
      break;
    case 'product-landing':
      LazyTemplate = lazy(() => import('../templates/product-landing'));
      sidenav = true;
      break;
    case 'search':
      LazyTemplate = lazy(() => import('../templates/landing'));
      sidenav = true;
      break;
    // Default template and guide template share very similar layouts
    default:
      LazyTemplate = lazy(() => import('../templates/document'));
      sidenav = true;
      break;
  }

  return {
    Template: (props) => (
      <Suspense fallback="Loading...">
        <LazyTemplate {...props}></LazyTemplate>
      </Suspense>
    ),
    sidenav,
    useChatbot,
  };
};

export { getTemplate };
