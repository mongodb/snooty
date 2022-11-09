import React, { useContext, useEffect } from 'react';
import { AppStore, Redoc } from 'redoc';
import { REDOC_OPTIONS } from './constants';
import { injectCustomComponents } from './custom-components';
import { OpenAPIContext } from './openapi-context';

const OpenAPIStatic = ({ metadata: { title: siteTitle } }) => {
  const { store } = useContext(OpenAPIContext);
  const { spec } = store;
  store['options'] = REDOC_OPTIONS;

  useEffect(() => {
    if (!spec) return;
    const pageTitle = spec.data.info.title;
    injectCustomComponents(pageTitle, siteTitle);
  }, [siteTitle, spec]);

  if (!spec) {
    console.error('Missing spec.');
    return null;
  }

  const deserializedStore = AppStore.fromJS(store);
  return <Redoc store={deserializedStore} />;
};

export default OpenAPIStatic;
