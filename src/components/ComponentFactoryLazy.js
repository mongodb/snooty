import React, { lazy } from 'react';

const ComponentMap = {
  openapi: lazy(() => import('./OpenAPI')),
  video: lazy(() => import('./Video')),
  instruqt: lazy(() => import('./Instruqt/index')),
  quiz: lazy(() => import('./Widgets/QuizWidget/QuizWidget')),
  quizchoice: lazy(() => import('./Widgets/QuizWidget/QuizChoice')),
};

export const LAZY_COMPONENTS = Object.keys(ComponentMap).reduce((res, key) => {
  const LazyComponent = ComponentMap[key];
  res[key] = (props) => (
    <React.Suspense>
      <LazyComponent {...props} />
    </React.Suspense>
  );
  return res;
}, {});
