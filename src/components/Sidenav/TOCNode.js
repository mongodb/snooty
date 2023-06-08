import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { cx, css as LeafyCSS } from '@leafygreen-ui/emotion';
import { SideNavItem } from '@leafygreen-ui/side-nav';
import { palette } from '@leafygreen-ui/palette';
import Icon from '@leafygreen-ui/icon';
import Link from '../Link';
import { NavigationContext } from '../../context/navigation-context';
import { VersionContext } from '../../context/version-context';
import { formatText } from '../../utils/format-text';
import { isActiveTocNode } from '../../utils/is-active-toc-node';
import { isSelectedTocNode } from '../../utils/is-selected-toc-node';
import SyncCloud from '../SyncCloud';
import { sideNavItemTOCStyling } from './styles/sideNavItem';
import VersionSelector from './VersionSelector';

// Toctree nodes begin at level 1 (i.e. toctree-l1) for top-level sections and increase
// with recursive depth
const BASE_NODE_LEVEL = 1;

const caretStyle = LeafyCSS`
  margin-top: 3px;
  margin-right: 5px;
  min-width: 16px;
`;

const overwriteLinkStyle = LeafyCSS`
  span {
    display: flex;
  }
`;

const scrollBehavior = { block: 'nearest', behavior: 'smooth' };

/**
 * Potential leaf node for the Table of Contents. May have children which are also
 * recursively TOCNodes.
 */
const TOCNode = ({ activeSection, handleClick, level = BASE_NODE_LEVEL, node, parentProj = '' }) => {
  const { title, slug, url, children, options = {} } = node;
  const { activeVersions } = useContext(VersionContext);
  const target = options.urls?.[activeVersions[options.project]] || slug || url;
  const hasChildren = !!children?.length;
  const hasVersions = !!(options?.versions?.length > 1);

  const isActive = isActiveTocNode(activeSection, slug, children);
  const isSelected = isSelectedTocNode(activeSection, slug);
  const isDrawer = !!(options && (options.drawer || options.versions)); // TODO: convert versions option to drawer in backend
  const isTocIcon = !!(options.tocicon === 'sync');
  const [isOpen, setIsOpen] = useState(isActive);
  const tocNodeRef = useRef(null);

  // effect of scrolling toc node into view on load
  const { completedFetch } = useContext(NavigationContext);
  const isScrolled = useRef(false);
  useEffect(() => {
    if (isScrolled.current) return;
    if (completedFetch && tocNodeRef.current && isSelected) {
      tocNodeRef.current.scrollIntoView(scrollBehavior);
      isScrolled.current = true;
    }
  }, [tocNodeRef, completedFetch, isSelected]);

  // If the active state of this node changes, change the open state to reflect it
  // Disable linter to handle conditional dependency that allows drawers to close when a new page is loaded
  useEffect(() => {
    setIsOpen(isActive);
  }, [isActive, isDrawer || hasChildren ? activeSection : null]); // eslint-disable-line react-hooks/exhaustive-deps

  // project prop is passed down from parent ToC node
  // hide node if not active according to version context
  if (parentProj && (!activeVersions[parentProj] || activeVersions[parentProj] !== options.version)) {
    return null;
  }

  const onCaretClick = (event) => {
    event.preventDefault();
    setIsOpen(!isOpen);
  };

  const NodeLink = () => {
    // If title is a plaintext string, render as-is. Otherwise, iterate over the text nodes to properly format titles.
    const formatTextOptions = {
      literalEnableInline: true,
    };
    // Wrap title in a div to prevent SideNavItem from awkwardly spacing titles with nested elements (e.g. code tags)
    const formattedTitle = (
      <div
        css={css`
          margin-left: ${hasChildren || isTocIcon ? '0px' : '21px'};
          color: ${isActive ? `${palette.green.dark3};` : `${palette.gray.dark3};`};
        `}
      >
        {formatText(title, formatTextOptions)}
      </div>
    );

    const iconType = isOpen ? 'CaretDown' : 'CaretRight';

    if (isDrawer && hasChildren) {
      return (
        <SideNavItem
          className={cx(sideNavItemTOCStyling({ level }))}
          as="a"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          <Icon className={cx(caretStyle)} glyph={iconType} fill={palette.gray.base} onClick={onCaretClick} />
          {isTocIcon && <SyncCloud />}
          {formattedTitle}
          {hasVersions && activeVersions[options.project] && (
            <VersionSelector versionedProject={options.project} tocVersionNames={options.versions} />
          )}
        </SideNavItem>
      );
    }

    return (
      <SideNavItem
        as={Link}
        to={target}
        active={isSelected}
        className={cx(sideNavItemTOCStyling({ level }), overwriteLinkStyle)}
        onClick={(e) => {
          setIsOpen(!isOpen);
        }}
        hideExternalIcon={true}
      >
        {hasChildren && (
          <Icon className={cx(caretStyle)} glyph={iconType} fill={palette.gray.base} onClick={onCaretClick} />
        )}
        {isTocIcon && <SyncCloud />}
        {formattedTitle}
        {hasVersions && activeVersions[options.project] && (
          <VersionSelector versionedProject={options.project} tocVersionNames={options.versions} />
        )}
      </SideNavItem>
    );
  };

  return (
    <>
      <NodeLink />
      {isOpen &&
        children.map((c) => {
          const key = `${c?.options?.version || ''}-${c.slug || c.url}`;
          return (
            <TOCNode
              activeSection={activeSection}
              handleClick={handleClick}
              node={c}
              level={level + 1}
              key={key}
              parentProj={options.project}
            />
          );
        })}
    </>
  );
};

TOCNode.propTypes = {
  level: PropTypes.number,
  node: PropTypes.shape({
    children: PropTypes.array.isRequired,
    options: PropTypes.shape({
      drawer: PropTypes.bool,
      tocicon: PropTypes.bool,
      styles: PropTypes.objectOf(PropTypes.string),
    }),
    slug: PropTypes.string,
    title: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.string]).isRequired,
    url: PropTypes.string,
  }).isRequired,
};

TOCNode.defaultProps = {
  level: BASE_NODE_LEVEL,
};

export default TOCNode;
