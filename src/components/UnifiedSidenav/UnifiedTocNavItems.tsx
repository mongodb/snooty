import React, { useState, useEffect, useRef, useContext } from 'react';
import styled from '@emotion/styled';
import Icon from '@leafygreen-ui/icon';
import { palette } from '@leafygreen-ui/palette';
import { SideNavGroup, SideNavItem } from '@leafygreen-ui/side-nav';
import { css as LeafyCSS, cx } from '@leafygreen-ui/emotion';
import Link from '../Link';
import { isSelectedTocNode } from '../../utils/is-selected-toc-node';
import { isCurrentPage } from '../../utils/is-current-page';
import { theme } from '../../theme/docsTheme';
import { isUnifiedTOCInDevMode } from '../../utils/is-unified-toc-dev';
import { VersionContext } from '../../context/version-context';
import { l1ItemStyling, groupHeaderStyling, l2ItemStyling } from './styles/SideNavItem';
import { UnifiedVersionDropdown } from './UnifiedVersionDropdown';
import { TocItem } from './types';

// Simple wrappers for TypeScript compatibility
const DevWrapper: React.FC<any> = ({ children, ...props }) => <div {...props}>{children}</div>;
const LinkWrapper: React.FC<any> = ({ children, ...props }) => <a {...props}>{children}</a>;

export const Border = styled('hr')`
  border: unset;
  border-bottom: 1px solid var(--sidenav-border-bottom-color);
  margin-bottom: 8px;
  width: 80%;
`;

const FormatTitle = styled.div`
  scroll-margin-bottom: ${theme.size.xxlarge};
`;

const overwriteLinkStyle = LeafyCSS`
  span {
    display: flex;
  }
  justify-content: space-between;
`;

const caretStyle = LeafyCSS`
  margin-top: 3px;
`;

// Anchors are sometimes included in toc.ts files, but we dont want to compare the current slug to the url with an anchor
export const removeAnchor = (str: string): string => {
  return str.replace(/#.*/, '');
};

// This checks what sidenav should load based on the active Tab
export const isActiveTocNode = (currentUrl: string, slug?: string, children?: TocItem[]): boolean => {
  if (currentUrl === undefined) return false;
  if (slug && isCurrentPage(currentUrl, removeAnchor(slug))) return true;
  if (children) {
    return children.reduce((a, b) => a || isActiveTocNode(currentUrl, b.url, b.items), false);
  }
  return false;
};

function isSelectedTab(url?: string, slug?: string): boolean {
  if (!url || !slug) return false;
  return isSelectedTocNode(removeAnchor(url), slug);
}

interface UnifiedTocNavItemProps extends TocItem {
  group?: boolean;
  isStatic?: boolean;
  slug: string;
  showSubNav?: boolean;
  currentL2s?: TocItem | null | undefined;
  isAccordion: boolean;
  setCurrentL1: (item: TocItem) => void;
  setCurrentL2s: (item: TocItem) => void;
  setShowDriverBackBtn: (show: boolean) => void;
  level: number;
}

export const UnifiedTocNavItem = ({
  label,
  group,
  collapsible,
  items,
  isStatic,
  contentSite,
  slug,
  showSubNav,
  currentL2s,
  isAccordion,
  setCurrentL1,
  setCurrentL2s,
  setShowDriverBackBtn,
  versionDropdown,
  versions,
  url,
  level,
}: UnifiedTocNavItemProps) => {
  const { activeVersions } = useContext(VersionContext);
  // These are the tab items that we dont need to show in the second pane but need to go through recursively
  // Unless in Mobile doing Accordion view

  if (isStatic) {
    if (isAccordion) {
      return (
        <>
          <StaticNavItem
            label={label}
            url={url}
            slug={slug}
            items={items}
            contentSite={contentSite}
            setCurrentL1={setCurrentL1}
            setCurrentL2s={setCurrentL2s}
            setShowDriverBackBtn={setShowDriverBackBtn}
            isAccordion={isAccordion}
          />
          {versionDropdown && url === currentL2s?.url && <UnifiedVersionDropdown contentSite={contentSite} />}
          {url === currentL2s?.url &&
            items?.map((tocItem) => (
              <UnifiedTocNavItem
                {...tocItem}
                level={level}
                key={tocItem.url + tocItem.label}
                slug={slug}
                isStatic={false}
                isAccordion={isAccordion}
                setCurrentL2s={setCurrentL2s}
                setCurrentL1={setCurrentL1}
                setShowDriverBackBtn={setShowDriverBackBtn}
              />
            ))}
          {items && items.length > 0 && url === currentL2s?.url && <Border />}
        </>
      );
    }

    return (
      <>
        {versionDropdown && <UnifiedVersionDropdown contentSite={contentSite} />}
        {items?.map((tocItem) => (
          <UnifiedTocNavItem
            {...tocItem}
            level={level}
            key={tocItem.url + tocItem.label}
            slug={slug}
            isStatic={false}
            isAccordion={isAccordion}
            setCurrentL2s={setCurrentL2s}
            setCurrentL1={setCurrentL1}
            setShowDriverBackBtn={setShowDriverBackBtn}
          />
        ))}
      </>
    );
  }

  // groups are for adding a static header, these can also be collapsible
  if (group) {
    return (
      <>
        <SideNavGroup header={label} collapsible={collapsible} className={cx(groupHeaderStyling({ isAccordion }))}>
          {versionDropdown && <UnifiedVersionDropdown contentSite={contentSite} />}
          {items?.map((tocItem) => (
            <UnifiedTocNavItem
              {...tocItem}
              level={level}
              key={tocItem.url + tocItem.label}
              slug={slug}
              isAccordion={isAccordion}
              setCurrentL2s={setCurrentL2s}
              setCurrentL1={setCurrentL1}
              setShowDriverBackBtn={setShowDriverBackBtn}
            />
          ))}
        </SideNavGroup>
      </>
    );
  }

  const handleClick = () => {
    // Allows for the showSubNav nodes to have their own L2 panel
    setShowDriverBackBtn(true);
    setCurrentL2s({ items, url, label, contentSite });
  };

  if (showSubNav) {
    return (
      <SideNavItem
        aria-label={label}
        as={isUnifiedTOCInDevMode ? DevWrapper : Link}
        contentSite={contentSite}
        to={url}
        onClick={handleClick}
        className={cx(l2ItemStyling({ level, isAccordion }))}
      >
        {label}
      </SideNavItem>
    );
  }

  const isVersionIncluded = versions?.includes?.includes(activeVersions[contentSite || '']);
  const isVersionExcluded = versions?.excludes && versions.excludes?.includes(activeVersions[contentSite || '']);
  const isVersionAllowed = !versions || isVersionIncluded || (isVersionExcluded !== undefined && !isVersionExcluded);

  // collapsible is for items that have nested links
  if (collapsible && isVersionAllowed) {
    return (
      <CollapsibleNavItem
        items={items}
        label={label}
        url={url}
        level={level}
        isAccordion={isAccordion}
        setShowDriverBackBtn={setShowDriverBackBtn}
        setCurrentL2s={setCurrentL2s}
        setCurrentL1={setCurrentL1}
        slug={slug}
        contentSite={contentSite}
        className={cx(l2ItemStyling({ level, isAccordion }))}
      />
    );
  }

  if (isVersionAllowed) {
    return (
      <SideNavItem
        active={isSelectedTab(url, slug)}
        aria-label={label}
        as={Link}
        contentSite={contentSite}
        to={url}
        className={cx(l2ItemStyling({ level, isAccordion }))}
      >
        {label}
      </SideNavItem>
    );
  }

  return null;
};

interface CollapsibleNavItemProps {
  items?: TocItem[];
  label: string;
  url?: string;
  slug: string;
  contentSite?: string;
  setShowDriverBackBtn: (show: boolean) => void;
  setCurrentL2s: (item: TocItem) => void;
  setCurrentL1: (item: TocItem) => void;
  isAccordion: boolean;
  level: number;
  className?: string;
}

function CollapsibleNavItem({
  items,
  label,
  url,
  slug,
  contentSite,
  setShowDriverBackBtn,
  setCurrentL2s,
  setCurrentL1,
  isAccordion,
  level,
}: CollapsibleNavItemProps): JSX.Element {
  const isActiveCollapsible = isActiveTocNode(slug, url, items);
  const [isOpen, setIsOpen] = useState<boolean>(isActiveCollapsible);
  const caretType = isOpen ? 'CaretDown' : 'CaretUp';
  const isActive = isSelectedTab(url, slug);
  const openedByCaret = useRef<boolean>(false);

  const onCaretClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    openedByCaret.current = !isOpen;
    setIsOpen((open) => !open);
  };

  const handleClick = () => {
    if (isOpen && openedByCaret.current) {
      openedByCaret.current = false; // Was opened by caret, keep it open and reset
      return;
    }
    setIsOpen((open) => !open);
  };

  useEffect(() => {
    setIsOpen(isActiveCollapsible);
  }, [isActiveCollapsible]);

  return (
    <>
      <SideNavItem
        as={url ? Link : LinkWrapper}
        contentSite={contentSite}
        to={url || undefined}
        active={isActive}
        className={cx(l2ItemStyling({ level, isAccordion }), overwriteLinkStyle)}
        onClick={handleClick}
        hideExternalIcon={true}
      >
        <FormatTitle>{label}</FormatTitle>
        <Icon
          className={cx(caretStyle)}
          glyph={caretType}
          fill={isActive ? 'inherit' : palette.gray.base}
          onClick={onCaretClick}
        />
      </SideNavItem>
      {isOpen &&
        items?.map((item) => (
          <UnifiedTocNavItem
            {...item}
            level={level + 1}
            key={item.url + item.label}
            slug={slug}
            setShowDriverBackBtn={setShowDriverBackBtn}
            setCurrentL2s={setCurrentL2s}
            setCurrentL1={setCurrentL1}
            isAccordion={isAccordion}
          />
        ))}
    </>
  );
}

interface StaticNavItemProps {
  label: string;
  url?: string;
  slug: string;
  items?: TocItem[];
  contentSite?: string;
  versionDropdown?: boolean;
  setCurrentL1: (item: TocItem) => void;
  setCurrentL2s: (item: TocItem) => void;
  isAccordion: boolean;
  setShowDriverBackBtn: (show: boolean) => void;
}

export function StaticNavItem({
  label,
  url,
  slug,
  items,
  contentSite,
  versionDropdown,
  setCurrentL1,
  setCurrentL2s,
  isAccordion,
  setShowDriverBackBtn,
}: StaticNavItemProps): JSX.Element {
  const isActive = isActiveTocNode(slug, url, items);

  return (
    <SideNavItem
      active={isActive}
      aria-label={label}
      contentSite={contentSite}
      hideExternalIcon={true}
      as={isUnifiedTOCInDevMode ? DevWrapper : Link}
      to={url}
      onClick={() => {
        setCurrentL1({ items, url, versionDropdown, label, contentSite });
        setCurrentL2s({ items, url, versionDropdown, label, contentSite });
        setShowDriverBackBtn(false);
      }}
      className={cx(l1ItemStyling({ isActive, isAccordion }))}
    >
      {label}
    </SideNavItem>
  );
}
