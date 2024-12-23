import React, { lazy } from 'react';
import { isOfflineDocsBuild } from '../utils/is-offline-docs-build';
import { SuspenseHelper } from './SuspenseHelper';
import OfflineNotAvailable from './OfflineNotAvailable';

const ComponentMap = {
  openapi: lazy(() => import('./OpenAPI')),
  video: lazy(() => import('./Video')),
  instruqt: lazy(() => import('./Instruqt')),
  quiz: lazy(() => import('./Widgets/QuizWidget/QuizWidget')),
  quizchoice: lazy(() => import('./Widgets/QuizWidget/QuizChoice')),
};

export const LAZY_COMPONENTS = Object.keys(ComponentMap).reduce((res, key) => {
  if (isOfflineDocsBuild && ['video', 'instruqt'].includes(key)) {
    res[key] = (props) => (!props.nodeData?.options?.drawer ? <OfflineNotAvailable assetKey={key} /> : null);
  } else {
    const LazyComponent = ComponentMap[key];
    res[key] = (props) => (
      <SuspenseHelper fallback={null}>
        <LazyComponent {...props} />
      </SuspenseHelper>
    );
  }
  return res;
}, {});
