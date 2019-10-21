import React from 'react';
import PropTypes from 'prop-types';
import { formatTocTitleStyle } from '../utils/format-toc-title-style';

const BASE_NODE_LEVEL = 1;

/**
 * Potential leaf node for the Table of Contents. May have children which are also
 * recursively TOCNodes.
 */
const TOCNode = ({ activeSection, node, toggleDrawer, level = BASE_NODE_LEVEL }) => {
  const { title, slug, url, children, options } = node;
  const target = slug || url;
  const hasChildren = !!children.length;
  const isExternal = !!url;
  const isActive = activeSection && activeSection.includes(slug);
  const anchorTagClassNames = `reference ${isActive ? 'current' : ''} ${isExternal ? 'external' : 'internal'}`;
  const toctreeSectionClasses = `toctree-l${level} ${isActive ? 'current selected-item' : ''}`;
  let formattedTitle = title;
  if (options && options.styles) {
    formattedTitle = formatTocTitleStyle(title, options.styles);
  }
  let NodeLink = () => (
    <a href={target} className={anchorTagClassNames}>
      {/* TODO Fix formatted title to this a tag */}
      <span className={hasChildren ? 'expand-icon docs-expand-arrow' : 'expand-icon'} />
      <span dangerouslySetInnerHTML={{ __html: formattedTitle }} />
    </a>
  );
  if (level === 1) {
    NodeLink = () => {
      const isDrawer = !!(options && options.drawer);
      formattedTitle = title;
      if (options && options.styles) {
        formattedTitle = formatTocTitleStyle(title, options.styles);
      }
      if (isDrawer) {
        return (
          <a
            onClick={() => toggleDrawer(slug)}
            className={anchorTagClassNames}
            dangerouslySetInnerHTML={{ __html: formattedTitle }}
          />
        );
      }
      return <a href={target} className={anchorTagClassNames} dangerouslySetInnerHTML={{ __html: formattedTitle }} />;
    };
  }
  return (
    <li className={toctreeSectionClasses}>
      <NodeLink />

      {isActive ? (
        <ul>
          {children.map(c => (
            <TOCNode
              activeSection={activeSection}
              node={c}
              level={level + 1}
              toggleDrawer={toggleDrawer}
              key={c.title}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
};

// <a href={target} className={anchorTagClassNames}>
//   <span className={hasChildren ? 'expand-icon docs-expand-arrow' : 'expand-icon'} />
//   <span dangerouslySetInnerHTML={{ __html: formattedTitle }} />
// </a>;

TOCNode.propTypes = {
  activeSection: PropTypes.string.isRequired,
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
  toggleDrawer: PropTypes.func.isRequired,
};

TOCNode.defaultProps = {
  // For legacy toctree CSS, start with level 2 for leaf nodes and increment based on recursion depth
  level: BASE_NODE_LEVEL,
};

export default TOCNode;
