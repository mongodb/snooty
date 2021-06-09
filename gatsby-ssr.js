import React from 'react';
import { ThemeProvider } from 'emotion-theming';
import { renderStylesToString } from '@leafygreen-ui/emotion';
import LeafyGreenProvider from '@leafygreen-ui/leafygreen-provider';
import { UserProvider } from './src/contexts/user-context';
import { renderToString } from 'react-dom/server';
import { theme } from './src/theme/docsTheme';

export const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    // Delighted
    <script
      type="text/javascript"
      dangerouslySetInnerHTML={{
        __html: `!function(e,t,r,n){if(!e[n]){for(var a=e[n]=[],i=["survey","reset","config","init","set","get","event","identify","track","page","screen","group","alias"],s=0;s<i.length;s++){var c=i[s];a[c]=a[c]||function(e){return function(){var t=Array.prototype.slice.call(arguments);a.push([e,t])}}(c)}a.SNIPPET_VERSION="1.0.1";var o=t.createElement("script");o.type="text/javascript",o.async=!0,o.src="https://d2yyd1h5u9mauk.cloudfront.net/integrations/web/v1/library/"+r+"/"+n+".js";var l=t.getElementsByTagName("script")[0];l.parentNode.insertBefore(o,l)}}(window,document,"Dk30CC86ba0nATlK","delighted");`,
      }}
    />,
  ]);
};

// Support SSR for LeafyGreen components
// https://github.com/mongodb/leafygreen-ui/tree/master/packages/emotion#server-side-rendering
export const replaceRenderer = ({ replaceBodyHTMLString, bodyComponent }) =>
  replaceBodyHTMLString(renderStylesToString(renderToString(bodyComponent)));

export const wrapRootElement = ({ element }) => (
  <ThemeProvider theme={theme}>
    <LeafyGreenProvider baseFontSize={16}>
      <UserProvider>{element}</UserProvider>
    </LeafyGreenProvider>
  </ThemeProvider>
);
