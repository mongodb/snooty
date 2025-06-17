import React from 'react';
import { TrackJS } from 'trackjs';
import { GlobalProviders } from './src/global-context-providers';

console.log('INSTALLING Testing TrackJS!');

// TrackJS is a tool that allows us to track errors and performance issues in our code.
TrackJS.install({
  token: 'c3fccd861d9b4238bfe1af83ebdec219',
  // for more configuration options, see https://docs.trackjs.com
});

export function wrapRootElement({ element }) {
  return <GlobalProviders element={element} />;
}
