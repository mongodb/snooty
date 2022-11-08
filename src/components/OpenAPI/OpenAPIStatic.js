import React, { useContext, useEffect } from 'react';
import { AppStore, Redoc } from 'redoc';
import { REDOC_OPTIONS } from './constants';
import { injectCustomComponents } from './custom-components';
import { OpenAPIContext } from './openapi-context';

const OpenAPIStatic = ({ metadata: { title: siteTitle } }) => {
  const { store } = useContext(OpenAPIContext);
  store['options'] = REDOC_OPTIONS;

  useEffect(() => {
    if (!store) return;
    const pageTitle = store.spec.data.info.title;
    injectCustomComponents(pageTitle, siteTitle);
  }, [siteTitle, store]);

  if (!store) {
    console.error('Missing spec store.');
    return null;
  }

  const deserializedStore = AppStore.fromJS(store);
  return <Redoc store={deserializedStore} />;
};

export default OpenAPIStatic;
