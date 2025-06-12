import React from 'react';
import { css, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import { theme } from '../theme/docsTheme';
import { normalizePath } from '../utils/normalize-path';
import type { RefRoleNode } from '../types/ast';
import ComponentFactory from './ComponentFactory';
import Link from './Link';

const cardRefStyling = css`
  background: ${palette.gray.light3};
  border-radius: ${theme.size.tiny};
  border: 1px solid ${palette.gray.light1};
  box-sizing: border-box;
  display: inline-block;
  font-size: ${theme.fontSize.small} !important;
  font-weight: 600;
  margin-bottom: ${theme.size.tiny};
  margin-right: ${theme.size.tiny};
  padding: ${theme.size.tiny};

  &:after {
    content: ' ➔';
  }
`;

interface RefRoleProps {
  nodeData: RefRoleNode;
  slug: string;
  cardRef: boolean;
  showLinkArrow: boolean;
}

const RefRole = ({ nodeData: { children, domain, fileid, name, url }, slug, cardRef, showLinkArrow }: RefRoleProps) => {
  // Render intersphinx target links
  const stylingClass = cardRef ? cardRefStyling : '';
  if (url) {
    return (
      <Link className={cx(stylingClass)} to={url} showLinkArrow={showLinkArrow}>
        {children.map((node, i) => (
          <ComponentFactory key={i} nodeData={node} />
        ))}
      </Link>
    );
  }

  // Render internal target and page links
  let link = '';
  if (fileid) {
    let [filename, html_id] = fileid;
    if (filename === 'index') filename = '/';

    if (filename === slug) {
      // Internal page link
      link = `#${html_id}`;
    } else if (html_id === '') {
      // :doc: link
      link = filename;
    } else {
      link = `${filename}/#${html_id}`;
    }
  }

  return (
    <Link className={cx(stylingClass)} to={normalizePath(link)} showLinkArrow={showLinkArrow}>
      {children.map((node, i) => (
        <ComponentFactory key={i} nodeData={node} />
      ))}
    </Link>
  );
};

export default RefRole;
