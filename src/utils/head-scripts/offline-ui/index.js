import React from 'react';
import bindTabUI from './tabs';
import bindCollapsibleUI from './collapsible';
import updateSidenavHeight from './sidenav';
import bindTabsSelectorsUI from './tabs-selectors';
import bindMethodSelectorUI from './method-selector';
import bindIOCode, { bindCodeCopy } from './code';

const OFFLINE_UI_CLASSNAME = 'snooty-offline-ui';

const getScript = ({ key, fn }) => (
  <script
    className={OFFLINE_UI_CLASSNAME}
    key={key}
    type="text/javascript"
    dangerouslySetInnerHTML={{ __html: `!${fn}()` }}
  />
);

export const OFFLINE_HEAD_SCRIPTS = [
  bindTabUI,
  updateSidenavHeight,
  bindTabsSelectorsUI,
  bindCollapsibleUI,
  bindMethodSelectorUI,
  bindIOCode,
  bindCodeCopy,
].map((fn, idx) => getScript({ key: `offline-docs-ui-${idx}`, fn }));
