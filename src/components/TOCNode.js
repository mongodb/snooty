import React from 'react';
import PropTypes from 'prop-types';
import { formatTocTitleStyle } from '../utils/format-toc-title-style';

const BASE_NODE_LEVEL = 2;
const CURRENT_PAGE = window.location.pathname;

/**
 * Potential leaf node for the Table of Contents. May have children which are also
 * recursively TOCNodes.
 */
const TOCNode = ({ node, level = BASE_NODE_LEVEL }) => {
  const { title, slug, url, children, options } = node;
  const target = slug || url;
  const hasChildren = !!children.length;
  const classNames = [];
  const isExternal = !!url;
  const isActive = slug === CURRENT_PAGE || CURRENT_PAGE === `/${slug}`;
  const liClassNames = `toctree-l${level} ${isActive ? 'current selected-item' : ''}`;
  if (isActive) {
    classNames.push('current');
  }
  if (isExternal) {
    classNames.push('reference external');
  } else {
    classNames.push('reference internal');
  }
  let formattedTitle = title;
  if (options && options.styles) {
    formattedTitle = formatTocTitleStyle(title, options.styles);
  }
  return (
    <li className={liClassNames}>
      <a href={target} className={classNames.join(' ')}>
        {/* TODO Fix formatted title to this a tag */}
        <span className={hasChildren ? 'expand-icon docs-expand-arrow' : 'expand-icon'} />
        <span dangerouslySetInnerHTML={{ __html: formattedTitle }} />
      </a>
      {isActive ? (
        <ul>
          {children.map(c => (
            <TOCNode node={c} level={level + 1} key={c.title} />
          ))}
        </ul>
      ) : null}
    </li>
  );
};

TOCNode.propTypes = {
  level: PropTypes.number,
  node: PropTypes.shape({
    title: PropTypes.string.isRequired,
    slug: PropTypes.string,
    url: PropTypes.string,
    children: PropTypes.array.isRequired,
    options: PropTypes.shape({
      drawer: PropTypes.bool,
      styles: PropTypes.objectOf(PropTypes.string),
    }),
  }).isRequired,
};

TOCNode.defaultProps = {
  // For legacy toctree CSS, start with level 2 for leaf nodes and increment based on recursion depth
  level: BASE_NODE_LEVEL,
};

export default TOCNode;
