import React from 'react';
import { ThemeProvider } from '@emotion/react';
import { renderStylesToString } from '@leafygreen-ui/emotion';
import LeafyGreenProvider from '@leafygreen-ui/leafygreen-provider';
import { renderToString } from 'react-dom/server';
import { theme } from './src/theme/docsTheme';
import EuclidCircularASemiBold from './src/styles/fonts/EuclidCircularA-Semibold-WebXL.woff';

export const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    // GTM Pathway
    <script
      key="pathway"
      type="text/javascript"
      dangerouslySetInnerHTML={{
        __html: `!function(e,n){var t=document.createElement("script"),o=null,x="pathway";t.async=!0,t.src='https://'+x+'.mongodb.com/'+(e?x+'-debug.js':''),document.head.append(t),t.addEventListener("load",function(){o=window.pathway.default,(n&&o.configure(n)),o.createProfile("mongodbcom").load(),window.segment=o})}();`,
      }}
    />,
    // Delighted
    <script
      key="delighted"
      type="text/javascript"
      dangerouslySetInnerHTML={{
        __html: `!function(e,t,r,n){if(!e[n]){for(var a=e[n]=[],i=["survey","reset","config","init","set","get","event","identify","track","page","screen","group","alias"],s=0;s<i.length;s++){var c=i[s];a[c]=a[c]||function(e){return function(){var t=Array.prototype.slice.call(arguments);a.push([e,t])}}(c)}a.SNIPPET_VERSION="1.0.1";var o=t.createElement("script");o.type="text/javascript",o.async=!0,o.src="https://d2yyd1h5u9mauk.cloudfront.net/integrations/web/v1/library/"+r+"/"+n+".js";var l=t.getElementsByTagName("script")[0];l.parentNode.insertBefore(o,l)}}(window,document,"Dk30CC86ba0nATlK","delighted");`,
      }}
    />,
    <link
      rel="preload"
      href={EuclidCircularASemiBold}
      as="font"
      type="font/woff"
      crossOrigin="anonymous"
      key="notoSansKR"
    />,
    <link rel="preconnect" href="https://fonts.googleapis.com" />,
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />,
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@100..900&display=swap" rel="stylesheet" />,
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap" rel="stylesheet" />,
  ]);
};

// Support SSR for LeafyGreen components
// https://github.com/mongodb/leafygreen-ui/tree/master/packages/emotion#server-side-rendering
export const replaceRenderer = ({ replaceBodyHTMLString, bodyComponent }) =>
  replaceBodyHTMLString(renderStylesToString(renderToString(bodyComponent)));

export const wrapRootElement = ({ element }) => (
  <ThemeProvider theme={theme}>
    <LeafyGreenProvider baseFontSize={16}>{element}</LeafyGreenProvider>
  </ThemeProvider>
);
