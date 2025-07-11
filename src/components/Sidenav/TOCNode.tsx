import React, { MouseEvent, useContext, useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { cx, css } from '@leafygreen-ui/emotion';
import { SideNavItem } from '@leafygreen-ui/side-nav';
import { palette } from '@leafygreen-ui/palette';
import Icon from '@leafygreen-ui/icon';
import { theme } from '../../theme/docsTheme';
import Link, { LinkProps } from '../Link';
import { DATA_TOC_NODE } from '../../constants';
import { VersionContext } from '../../context/version-context';
import { formatText } from '../../utils/format-text';
import { isActiveTocNode } from '../../utils/is-active-toc-node';
import { isSelectedTocNode } from '../../utils/is-selected-toc-node';
import { isOfflineDocsBuild } from '../../utils/is-offline-docs-build';
import { TocTreeEntry } from '../../types/ast';
import { sideNavItemTOCStyling } from './styles/sideNavItem';
import VersionSelector from './VersionSelector';

// Toctree nodes begin at level 1 (i.e. toctree-l1) for top-level sections and increase
// with recursive depth
const BASE_NODE_LEVEL = 1;

const caretStyle = css`
  margin-top: 3px;
  margin-right: 5px;
  min-width: 16px;
`;

const overwriteLinkStyle = css`
  span {
    display: flex;
  }
`;

const FormatTitle = styled.div<{ marginLeft: string }>`
  margin-left: ${({ marginLeft }) => marginLeft};
  scroll-margin-bottom: ${theme.size.xxlarge};
  overflow: hidden;
  text-overflow: ellipsis;
`;

const scrollBehavior: ScrollIntoViewOptions = { block: 'nearest', behavior: 'smooth' };

export type TOCNodeProps = {
  activeSection: string;
  handleClick: () => void;
  node: TocTreeEntry;
  level?: number;
  parentProj?: string;
};

/**
 * Potential leaf node for the Table of Contents. May have children which are also
 * recursively TOCNodes.
 */
const TOCNode = ({ activeSection, handleClick, level = BASE_NODE_LEVEL, node, parentProj = '' }: TOCNodeProps) => {
  const { title, slug, url, children, options = {} } = node;
  const { activeVersions } = useContext(VersionContext);
  const target = options.urls?.[activeVersions[options.project ?? '']] || slug || url;
  const hasChildren = !!children?.length;
  const hasVersions = !!(options?.versions?.length ?? 0 > 1);

  const isActive = isActiveTocNode(activeSection, slug, children);
  const isSelected = isSelectedTocNode(activeSection, slug);
  const isDrawer = !!(options && (options.drawer || options.versions)); // TODO: convert versions option to drawer in backend
  const isTocIcon = !!(options.tocicon === 'sync');
  const [isOpen, setIsOpen] = useState(isActive);
  const tocNodeRef = useRef<HTMLDivElement>(null);

  // effect of scrolling toc node into view on load
  const isScrolled = useRef(false);
  useEffect(() => {
    if (isScrolled.current) return;
    if (tocNodeRef.current && isSelected) {
      tocNodeRef.current.scrollIntoView(scrollBehavior);
      isScrolled.current = true;
    }
  }, [tocNodeRef, isSelected]);

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

  const onCaretClick = (event: MouseEvent<SVGSVGElement>) => {
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
      <FormatTitle ref={tocNodeRef} marginLeft={hasChildren || isTocIcon ? '0px' : '21px'}>
        {formatText(title, formatTextOptions)}
      </FormatTitle>
    );

    const iconType = isOpen ? 'CaretDown' : 'CaretRight';

    if (isDrawer && hasChildren) {
      return (
        <SideNavItem
          className={cx(sideNavItemTOCStyling({ level }))}
          as={({ children, ...props }: LinkProps) =>
            isOfflineDocsBuild ? (
              <Link {...props} to={target}>
                {children}
              </Link>
            ) : (
              <a {...props}>{children}</a>
            )
          }
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          data-position={DATA_TOC_NODE}
        >
          <Icon className={cx(caretStyle)} glyph={iconType} fill={palette.gray.base} onClick={onCaretClick} />
          {formattedTitle}
          {hasVersions && options.project && activeVersions[options.project] && (
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
        data-position={DATA_TOC_NODE}
      >
        {hasChildren && (
          <Icon className={cx(caretStyle)} glyph={iconType} fill={palette.gray.base} onClick={onCaretClick} />
        )}
        {formattedTitle}
        {hasVersions && options.project && activeVersions[options.project] && (
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

export default TOCNode;
