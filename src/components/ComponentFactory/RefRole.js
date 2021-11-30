import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { uiColors } from '@leafygreen-ui/palette';
import ComponentFactory from './index';
import Link from '../Link';
import { normalizePath } from '../../utils/normalize-path';
import { theme } from '../../theme/docsTheme';

// TODO: <untangle card-ref and refrole, this styling has the side effect of changing all refroles on cards into card-refs>
const CardRef = styled(Link)`
  background: ${uiColors.gray.light3};
  border-radius: ${theme.size.tiny};
  border: 1px solid ${uiColors.gray.light1};
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

const RefRole = ({ nodeData: { children, domain, fileid, name, url }, slug, cardRef }) => {
  // Render intersphinx target links
  const CurrRefRole = cardRef ? CardRef : Link;

  if (url) {
    return (
      <CurrRefRole to={url}>
        {children.map((node, i) => (
          <ComponentFactory key={i} nodeData={node} />
        ))}
      </CurrRefRole>
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
    <CurrRefRole to={normalizePath(link)} onClick={(e) => stopPropagation(e)}>
      {children.map((node, i) => (
        <ComponentFactory key={i} nodeData={node} />
      ))}
    </CurrRefRole>
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
};

export default RefRole;
