import React, { lazy } from 'react';
import { isOfflineDocsBuild } from '../utils/is-offline-docs-build';
import { SuspenseHelper } from './SuspenseHelper';
import OfflineNotAvailable from './OfflineNotAvailable';

type LazyComponentType = 'openapi' | 'video' | 'instruqt';
type LazyComponentMap = Record<LazyComponentType, React.LazyExoticComponent<any>>;

const ComponentMap: LazyComponentMap = {
  openapi: lazy(() => import('./OpenAPI')),
  video: lazy(() => import('./Video')),
  instruqt: lazy(() => import('./Instruqt')),
};

const isOfflineNotAvailableKey = (key: LazyComponentType): key is 'video' | 'instruqt' => {
  return ['video', 'instruqt'].includes(key);
};

export const LAZY_COMPONENTS: Record<string, React.ComponentType<any>> = (
  Object.keys(ComponentMap) as LazyComponentType[]
).reduce<Record<string, React.ComponentType<any>>>((res, key) => {
  if (isOfflineDocsBuild && isOfflineNotAvailableKey(key)) {
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
