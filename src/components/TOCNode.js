import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Link from './Link';
import { formatText } from '../utils/format-text';
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
  const { activeDrawer, activePage, toggleDrawer, togglePage } = useContext(TOCContext);
  const isActive = isActiveTocNode(activePage, slug, children) || activeDrawer === slug;
  const anchorTagClassNames = `reference ${isActive ? 'current' : ''} ${isExternalLink ? 'external' : 'internal'}`;
  const isSelected = isSelectedTocNode(activePage, slug);
  const toctreeSectionClasses = `toctree-l${level} ${isActive ? 'current' : ''} ${isSelected ? 'selected-item' : ''}`;
  const isDrawer = !!(options && options.drawer);

  // Show caret if not on first level of TOC
  const caretIcon =
    level !== BASE_NODE_LEVEL ? (
      <span className={hasChildren ? 'expand-icon docs-expand-arrow' : 'expand-icon'} />
    ) : null;

  const NodeLink = () => {
    // If title is a plaintext string, render as-is. Otherwise, iterate over the text nodes to properly format titles.
    const formattedTitle = formatText(title);

    if (isDrawer && children.length > 0) {
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
          {caretIcon}
          {formattedTitle}
        </a>
      );
    }
    return (
      <Link
        to={target}
        aria-expanded={hasChildren ? isActive : undefined}
        className={anchorTagClassNames}
        onClick={() => togglePage(slug)}
      >
        {caretIcon}
        {formattedTitle}
      </Link>
    );
  };
  return (
    <li className={toctreeSectionClasses}>
      <NodeLink />
      {isActive ? (
        <ul>
          {children.map(c => {
            const key = c.slug || c.url;
            return <TOCNode node={c} level={level + 1} key={key} />;
          })}
        </ul>
      ) : null}
    </li>
  );
};

TOCNode.propTypes = {
  level: PropTypes.number,
  node: PropTypes.shape({
    title: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.string]).isRequired,
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
