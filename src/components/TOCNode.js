import React, { useContext, useEffect, useState } from 'react';
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
  const { activeSection } = useContext(TOCContext);
  const isActive = isActiveTocNode(activeSection, slug, children);
  const anchorTagClassNames = `reference ${isActive ? 'current' : ''} ${isExternalLink ? 'external' : 'internal'}`;
  const isSelected = isSelectedTocNode(activeSection, slug);
  const toctreeSectionClasses = `toctree-l${level} ${isActive ? 'current' : ''} ${isSelected ? 'selected-item' : ''}`;
  const isDrawer = !!(options && options.drawer);

  const [isOpen, setIsOpen] = useState(isActive);

  // If the active state of this node changes, change the open state to reflect it
  // Disable linter to handle conditional dependency that allows drawers to close when a new page is loaded
  useEffect(() => {
    setIsOpen(isActive);
  }, [isActive, isDrawer ? activeSection : null]); // eslint-disable-line react-hooks/exhaustive-deps

  // Show caret if not on first level of TOC
  const caretIcon =
    level !== BASE_NODE_LEVEL ? (
      <span
        className={hasChildren ? 'expand-icon docs-expand-arrow' : 'expand-icon'}
        style={{ WebkitTransform: isOpen ? 'rotate(135deg)' : null, transform: isOpen ? 'rotate(135deg)' : null }}
      />
    ) : null;

  const formatTextOptions = {
    literalEnableInline: true,
  };

  const NodeLink = () => {
    // If title is a plaintext string, render as-is. Otherwise, iterate over the text nodes to properly format titles.
    const formattedTitle = formatText(title, formatTextOptions);

    if (isDrawer && children.length > 0) {
      const _toggleDrawerOnEnter = (e) => {
        if (e.key === 'Enter') {
          setIsOpen(!isOpen);
        }
      };
      // TODO: Ideally, this value should be a button, but to keep consistent with CSS render as anchor
      return (
        <Link
          onClick={(e) => {
            e.preventDefault();
            setIsOpen(!isOpen);
          }}
          onKeyDown={_toggleDrawerOnEnter}
          className={anchorTagClassNames}
          aria-expanded={hasChildren ? isActive : undefined}
          role="button"
          tabIndex="0"
          to={target}
        >
          {caretIcon}
          {formattedTitle}
        </Link>
      );
    }
    return (
      <Link to={target} aria-expanded={hasChildren ? isActive : undefined} className={anchorTagClassNames}>
        {caretIcon}
        {formattedTitle}
      </Link>
    );
  };
  return (
    <li className={toctreeSectionClasses}>
      <NodeLink />
      {isOpen ? (
        <ul>
          {children.map((c) => {
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
