import React from 'react';
import { ThemeProvider } from '@emotion/react';
import { renderStylesToString } from '@leafygreen-ui/emotion';
import { renderToString } from 'react-dom/server';
import { theme } from './src/theme/docsTheme';
import EuclidCircularASemiBold from './src/styles/fonts/EuclidCircularA-Semibold-WebXL.woff';
import redirectBasedOnLang from './src/utils/head-scripts/redirect-based-on-lang';
import { OFFLINE_HEAD_SCRIPTS } from './src/utils/head-scripts/offline-ui';
import { isOfflineDocsBuild } from './src/utils/is-offline-docs-build';
import { getHtmlLangFormat } from './src/utils/locale';

export const onRenderBody = ({ setHeadComponents, setHtmlAttributes }) => {
  if (isOfflineDocsBuild) {
    return setHeadComponents([...OFFLINE_HEAD_SCRIPTS]);
  }

  const headComponents = [
    // GTM Pathway
    <script
      key="pathway"
      type="text/javascript"
      dangerouslySetInnerHTML={{
        __html: `!function(e,n){var t=document.createElement("script"),o=null,x="pathway";t.async=!0,t.src='https://'+x+'.mongodb.com/'+(e?x+'-debug.js':''),document.head.append(t),t.addEventListener("load",function(){o=window.pathway.default,(n&&o.configure(n)),o.createProfile("mongodbcom").load(),window.segment=o})}();`,
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
    // Detect dark mode
    // before document body
    // to prevent flash of incorrect theme
    headComponents.push(
      <script
        key="dark-mode"
        dangerouslySetInnerHTML={{
          __html: `
            !function () {
              try {
                var d = document.documentElement.classList;
                d.remove("light-theme", "dark-theme");
                var h = window.location.href;
                if (h.includes('/openapi/preview')) return;
                var e = JSON.parse(localStorage.getItem("mongodb-docs"))?.["theme"];
                if ("system" === e || (!e)) {
                  var t = "(prefers-color-scheme: dark)",
                    m = window.matchMedia(t);
                  m.media !== t || m.matches ? d.add("dark-theme", "system") : d.add("light-theme", "system");
                } else if (e) {
                  var x = { "light-theme": "light-theme", "dark-theme": "dark-theme" };
                  x[e] && d.add(x[e]);
                }
              } catch (e) {
                console.error(e);
              }
            }();
          `,
        }}
      />
    );
  }

  // We want to exclude writers' staging (aka "production", aka "prd")
  if (process.env.SNOOTY_ENV !== 'production') {
    // Client-side redirect based on browser's language settings.
    headComponents.push(
      <script
        key="browser-lang-redirect"
        type="text/javascript"
        dangerouslySetInnerHTML={{
          // Call function immediately on load
          __html: `!${redirectBasedOnLang}()`,
        }}
      />
    );
  }

  setHtmlAttributes({
    // Help work with translated content locally; Smartling should handle rewriting the lang
    lang: process.env.GATSBY_LOCALE ? getHtmlLangFormat(process.env.GATSBY_LOCALE) : 'en',
  });
  setHeadComponents(headComponents);
};

// Support SSR for LeafyGreen components
// https://github.com/mongodb/leafygreen-ui/tree/master/packages/emotion#server-side-rendering
export const replaceRenderer = ({ replaceBodyHTMLString, bodyComponent }) =>
  replaceBodyHTMLString(renderStylesToString(renderToString(bodyComponent)));

export const wrapRootElement = ({ element }) => <ThemeProvider theme={theme}>{element}</ThemeProvider>;
