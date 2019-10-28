import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { formatTocTitleStyle } from '../utils/format-toc-title-style';
import { isActiveTocNode } from '../utils/is-active-toc-node';
import { isSelectedTocNode } from '../utils/is-selected-toc-node';
import { TOCContext } from './toc-context';

// Toctree nodes begin at level 1 (i.e. toctree-l1) for top-level sections and increase
// with recursive depth
const BASE_NODE_LEVEL = 1;

/**
 * Potential leaf node for the Table of Contents. May have children which are also
 * recursively TOCNodes.
 */
const TOCNode = ({ node, level = BASE_NODE_LEVEL }) => {
  const { title, slug, url, children, options = {} } = node;
  const target = slug || url;
  const hasChildren = !!children.length;
  const isExternalLink = !!url;
  const { activeSection, toggleDrawer } = useContext(TOCContext);
  const isActive = isActiveTocNode(activeSection, slug, children);
  const anchorTagClassNames = `reference ${isActive ? 'current' : ''} ${isExternalLink ? 'external' : 'internal'}`;
  const isSelected = isSelectedTocNode(activeSection, slug);
  const toctreeSectionClasses = `toctree-l${level} ${isActive ? 'current' : ''} ${isSelected ? 'selected-item' : ''}`;

  const NodeLink = () => {
    const formattedTitle = formatTocTitleStyle(title, options.styles);
    if (level === BASE_NODE_LEVEL) {
      const isDrawer = !!(options && options.drawer);
      if (isDrawer) {
        const _toggleDrawerOnEnter = e => {
          if (e.key === 'Enter') {
            toggleDrawer(slug);
          }
        };
        // TODO: Ideally, this value should be a button, but to keep consistent with CSS render as anchor
        return (
          <a // eslint-disable-line jsx-a11y/anchor-is-valid
            onClick={() => toggleDrawer(slug)}
            onKeyDown={_toggleDrawerOnEnter}
            className={anchorTagClassNames}
            aria-expanded={hasChildren ? isActive : undefined}
            role="button"
            tabIndex="0"
          >
            {formattedTitle}
          </a>
        );
      }
      return (
        <a href={target} aria-expanded={hasChildren ? isActive : undefined} className={anchorTagClassNames}>
          {formattedTitle}
        </a>
      );
    }

    // In this case, we have a node which should be rendered with the 'expand-icon'
    return (
      <a href={target} className={anchorTagClassNames} aria-expanded={hasChildren ? isActive : undefined}>
        <span className={hasChildren ? 'expand-icon docs-expand-arrow' : 'expand-icon'} />
        {formattedTitle}
      </a>
    );
  };
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
  level: BASE_NODE_LEVEL,
};

export default TOCNode;
