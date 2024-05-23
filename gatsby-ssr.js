import React from 'react';
import { ThemeProvider } from '@emotion/react';
import { renderStylesToString } from '@leafygreen-ui/emotion';
import { renderToString } from 'react-dom/server';
import { theme } from './src/theme/docsTheme';
import EuclidCircularASemiBold from './src/styles/fonts/EuclidCircularA-Semibold-WebXL.woff';

export const onRenderBody = ({ setHeadComponents }) => {
  const headComponents = [
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
      key="euclidCircularSemiBold"
    />,
    <link key="preconnectGoogleAPIS" rel="preconnect" href="https://fonts.googleapis.com" />,
    <link key="preconnectGStatic" rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />,
    <link
      key="notoSansCS"
      href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@100..900&display=swap"
      rel="stylesheet"
    />,
    <link
      key="notoSansKR"
      href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap"
      rel="stylesheet"
    />,
    <link
      key="notoSansJP"
      href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap"
      rel="stylesheet"
    ></link>,
  ];
  if (process.env['GATSBY_ENABLE_DARK_MODE'] === 'true') {
    headComponents.push(
      // Detect dark mode
      <script
        key="dark-mode"
        dangerouslySetInnerHTML={{
          // __html: `alert('this is an alert test')()`
          __html: `!function(){  try {
          var d = document.documentElement.classList;
          d.remove("light-theme", "dark-theme");
          var e = JSON.parse(localStorage.getItem("mongodb-docs"))?.['theme'];
          if ("system" === e || (!e && true)) {
            var t = "(prefers-color-scheme: dark)",
              m = window.matchMedia(t);
            m.media !== t || m.matches ? d.add("dark-theme") : d.add("light-theme");
          } else if (e) {
            var x = { "light-theme": "light-theme", "dark-theme": "dark-theme" };
            d.add(x[e]);
          }
        } catch (e) {
         console.error(e)
        }}()`,
        }}
      />
    );
  }
  setHeadComponents(headComponents);
};

// Support SSR for LeafyGreen components
// https://github.com/mongodb/leafygreen-ui/tree/master/packages/emotion#server-side-rendering
export const replaceRenderer = ({ replaceBodyHTMLString, bodyComponent }) =>
  replaceBodyHTMLString(renderStylesToString(renderToString(bodyComponent)));

export const wrapRootElement = ({ element }) => <ThemeProvider theme={theme}>{element}</ThemeProvider>;
