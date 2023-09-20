import React from 'react';
import PropTypes from 'prop-types';
import { css, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import { theme } from '../theme/docsTheme';
import { normalizePath } from '../utils/normalize-path';
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

const stopPropagation = function (e) {
  e.stopPropagation();
  e.nativeEvent.stopImmediatePropagation();
};

const RefRole = ({ nodeData: { children, domain, fileid, name, url }, slug, cardRef, showLinkArrow }) => {
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
    <Link
      className={cx(stylingClass)}
      to={normalizePath(link)}
      onClick={(e) => stopPropagation(e)}
      showLinkArrow={showLinkArrow}
    >
      {children.map((node, i) => (
        <ComponentFactory key={i} nodeData={node} />
      ))}
    </Link>
  );
};

RefRole.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
    domain: PropTypes.string.isRequired,
    fileid: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.string.isRequired,
    url: PropTypes.string,
  }).isRequired,
  slug: PropTypes.string.isRequired,
  showLinkArrow: PropTypes.bool,
};

export default RefRole;
