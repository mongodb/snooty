import React, { lazy } from 'react';
import { SuspenseHelper } from './SuspenseHelper';

const ComponentMap = {
  openapi: lazy(() => import('./OpenAPI')),
  video: lazy(() => import('./Video')),
  instruqt: lazy(() => import('./Instruqt')),
  quiz: lazy(() => import('./Widgets/QuizWidget/QuizWidget')),
  quizchoice: lazy(() => import('./Widgets/QuizWidget/QuizChoice')),
};

export const LAZY_COMPONENTS = Object.keys(ComponentMap).reduce((res, key) => {
  const LazyComponent = ComponentMap[key];
  res[key] = (props) => (
    <SuspenseHelper fallback={null}>
      <LazyComponent {...props} />
    </SuspenseHelper>
  );
  return res;
}, {});
