import React, { lazy } from 'react';

const ComponentMap = {
  openapi: lazy(() => import('../../../../src/components/OpenAPI')),
  video: lazy(() => import('../../../../src/components/Video')),
  instruqt: lazy(() => import('../../../../src/components/Instruqt')),
  quiz: lazy(() => import('../../../../src/components/Widgets/QuizWidget/QuizWidget')),
  quizchoice: lazy(() => import('../../../../src/components/Widgets/QuizWidget/QuizChoice')),
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
