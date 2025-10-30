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
import { tocItemKey } from '../../utils/create-toc-key';
import { reportAnalytics } from '../../utils/report-analytics';
import { currentScrollPosition } from '../../utils/current-scroll-position';
import { l1ItemStyling, groupHeaderStyling, l2ItemStyling } from './styles/SideNavItem';
import { UnifiedVersionDropdown } from './UnifiedVersionDropdown';
import { TocItem } from './types';

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
  min-width: 16px;
`;

const sidenavAnalytics = (label: string, element?: HTMLElement | null) => {
  const translatedLabel = element?.textContent?.trim() || label;

  reportAnalytics('Click', {
    position: 'sidenav item',
    label: label,
    label_text_displayed: translatedLabel,
    scroll_position: currentScrollPosition(),
    tagbook: 'true',
  });
};

// Anchors are sometimes included in toc.ts files, but we dont want to compare the current slug to the url with an anchor
export const removeAnchor = (str: string): string => {
  return str.replace(/#.*/, '');
};

// This checks what sidenav should load based on the active Tab
export const isActiveTocNode = (currentUrl: string, slug?: string, children?: TocItem[]): boolean => {
  if (currentUrl === undefined) return false;
  if (slug && isCurrentPage(currentUrl, removeAnchor(slug))) return true;
  if (children) {
    return children.reduce((a, b) => a || isActiveTocNode(currentUrl, b.newUrl, b.items), false);
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
  newUrl,
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
            newUrl={newUrl}
            slug={slug}
            items={items}
            contentSite={contentSite}
            setCurrentL1={setCurrentL1}
            setCurrentL2s={setCurrentL2s}
            setShowDriverBackBtn={setShowDriverBackBtn}
            isAccordion={isAccordion}
          />
          {versionDropdown && newUrl === currentL2s?.newUrl && <UnifiedVersionDropdown contentSite={contentSite} />}
          {newUrl === currentL2s?.newUrl &&
            items?.map((tocItem) => (
              <UnifiedTocNavItem
                {...tocItem}
                level={level}
                key={tocItemKey(tocItem)}
                slug={slug}
                isStatic={false}
                isAccordion={isAccordion}
                setCurrentL2s={setCurrentL2s}
                setCurrentL1={setCurrentL1}
                setShowDriverBackBtn={setShowDriverBackBtn}
              />
            ))}
          {items && items.length > 0 && newUrl === currentL2s?.newUrl && <Border />}
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
            key={tocItemKey(tocItem)}
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
              level={isAccordion ? level + 1 : level}
              key={tocItemKey(tocItem)}
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

  const handleClick = (event: React.MouseEvent) => {
    // Allows for the showSubNav nodes to have their own L2 panel
    const target = event.currentTarget as HTMLElement;
    sidenavAnalytics(label, target);
    setShowDriverBackBtn(true);
    setCurrentL2s({ items, newUrl, label, contentSite });
  };

  if (showSubNav) {
    return (
      <SideNavItem
        aria-label={label}
        as={isUnifiedTOCInDevMode ? (undefined as never) : Link}
        contentSite={contentSite}
        to={newUrl}
        onClick={handleClick}
        className={cx(l2ItemStyling({ level, isAccordion }))}
      >
        {label}
      </SideNavItem>
    );
  }

  const isVersionIncluded = contentSite && versions?.includes?.includes(activeVersions[contentSite]);
  const isVersionExcluded =
    contentSite && versions?.excludes && versions.excludes?.includes(activeVersions[contentSite]);
  const isVersionAllowed = !versions || isVersionIncluded || (isVersionExcluded !== undefined && !isVersionExcluded);

  // collapsible is for items that have nested links
  if (collapsible && isVersionAllowed) {
    return (
      <CollapsibleNavItem
        items={items}
        label={label}
        newUrl={newUrl}
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
        active={isSelectedTab(newUrl, slug)}
        aria-label={label}
        as={Link}
        contentSite={contentSite}
        to={newUrl}
        onClick={(event) => {
          sidenavAnalytics(label, event.currentTarget as HTMLElement);
        }}
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
  newUrl?: string;
  slug: string;
  contentSite?: string;
  setShowDriverBackBtn: (show: boolean) => void;
  setCurrentL2s: (item: TocItem) => void;
  setCurrentL1: (item: TocItem) => void;
  isAccordion: boolean;
  level: number;
  className?: string;
}

export const CollapsibleNavItem = ({
  items,
  label,
  newUrl,
  slug,
  contentSite,
  setShowDriverBackBtn,
  setCurrentL2s,
  setCurrentL1,
  isAccordion,
  level,
}: CollapsibleNavItemProps) => {
  const isActiveCollapsible = isActiveTocNode(slug, newUrl, items);
  const [isOpen, setIsOpen] = useState<boolean>(isActiveCollapsible);
  const caretType = isOpen ? 'CaretDown' : 'CaretUp';
  const isActive = isSelectedTab(newUrl, slug);
  const openedByCaret = useRef<boolean>(false);

  const onCaretClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    openedByCaret.current = !isOpen;
    setIsOpen((open) => !open);
  };

  const handleClick = (event: React.MouseEvent) => {
    sidenavAnalytics(label, event.currentTarget as HTMLElement);
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
        as={newUrl ? Link : (undefined as never)}
        contentSite={contentSite}
        to={newUrl || undefined}
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
            key={tocItemKey(item)}
            slug={slug}
            setShowDriverBackBtn={setShowDriverBackBtn}
            setCurrentL2s={setCurrentL2s}
            setCurrentL1={setCurrentL1}
            isAccordion={isAccordion}
          />
        ))}
    </>
  );
};

interface StaticNavItemProps {
  label: string;
  newUrl?: string;
  slug: string;
  items?: TocItem[];
  contentSite?: string;
  versionDropdown?: boolean;
  setCurrentL1: (item: TocItem) => void;
  setCurrentL2s: (item: TocItem) => void;
  isAccordion: boolean;
  setShowDriverBackBtn: (show: boolean) => void;
}

export const StaticNavItem = ({
  label,
  newUrl,
  slug,
  items,
  contentSite,
  versionDropdown,
  setCurrentL1,
  setCurrentL2s,
  isAccordion,
  setShowDriverBackBtn,
}: StaticNavItemProps) => {
  const isActive = isActiveTocNode(slug, newUrl, items);

  return (
    <SideNavItem
      active={isActive}
      aria-label={label}
      contentSite={contentSite}
      hideExternalIcon={true}
      as={isUnifiedTOCInDevMode ? (undefined as never) : Link}
      to={newUrl}
      onClick={(event) => {
        sidenavAnalytics(label, event.currentTarget as HTMLElement);
        setCurrentL1({ items, newUrl, versionDropdown, label, contentSite });
        setCurrentL2s({ items, newUrl, versionDropdown, label, contentSite });
        setShowDriverBackBtn(false);
      }}
      className={cx(l1ItemStyling({ isActive, isAccordion }))}
    >
      {label}
    </SideNavItem>
  );
};
