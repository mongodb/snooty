import React, { useState } from 'react';
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
import { l1ItemStyling, groupHeaderStyling, l2ItemStyling } from './styles/SideNavItem';
import { UnifiedVersionDropdown } from './UnifiedVersionDropdown';

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

// This checks what sidenav should load based on the active Tab
export const isActiveTocNode = (currentUrl, slug, children) => {
  if (currentUrl === undefined) return false;
  if (isCurrentPage(currentUrl, slug)) return true;
  if (children) {
    return children.reduce((a, b) => a || isActiveTocNode(currentUrl, b.newUrl, b.items), false);
  }
  return false;
};

function isSelectedTab(url, slug, pathPrefix) {
  // // Hijacking the isSelectedTab for unified toc in dev and preview builds
  // if (isUnifiedTocActive(url, pathPrefix)) return true;
  return isSelectedTocNode(url, slug);
}

export function UnifiedTocNavItem({
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
  newUrl,
  level,
}) {
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
            setShowDriverBackBtn={setShowDriverBackBtn}
            isAccordion={isAccordion}
          />
          {versionDropdown && newUrl === currentL2s?.newUrl && <UnifiedVersionDropdown contentSite={contentSite} />}
          {console.log('peanut butter', newUrl, currentL2s, items)}
          {newUrl === currentL2s?.newUrl &&
            items?.map((tocItem) => (
              <UnifiedTocNavItem
                {...tocItem}
                level={level}
                key={tocItem.newUrl + tocItem.label}
                slug={slug}
                isStatic={false}
                isAccordion={isAccordion}
                setCurrentL2s={setCurrentL2s}
                setShowDriverBackBtn={setShowDriverBackBtn}
              />
            ))}
          {newUrl === currentL2s?.newUrl && <Border />}
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
            key={tocItem.newUrl + tocItem.label}
            slug={slug}
            isStatic={false}
            isAccordion={isAccordion}
            setCurrentL2s={setCurrentL2s}
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
          {versionDropdown && <UnifiedVersionDropdown contentSite={contentSite} isAccordion={isAccordion} />}
          {items?.map((tocItem) => (
            <UnifiedTocNavItem
              {...tocItem}
              level={level}
              key={tocItem.newUrl + tocItem.label}
              slug={slug}
              isAccordion={isAccordion}
              setCurrentL2s={setCurrentL2s}
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
    setCurrentL2s({ items, newUrl });
  };

  if (showSubNav) {
    return (
      <SideNavItem
        aria-label={label}
        as={isUnifiedTOCInDevMode ? null : Link}
        contentSite={contentSite}
        to={newUrl}
        onClick={handleClick}
        className={cx(l2ItemStyling({ level, isAccordion }))}
      >
        {label}
      </SideNavItem>
    );
  }

  // collapsible is for items that have nested links
  if (collapsible) {
    return (
      <CollapsibleNavItem
        items={items}
        label={label}
        newUrl={newUrl}
        level={level}
        isAccordion={isAccordion}
        slug={slug}
        contentSite={contentSite}
        className={cx(l2ItemStyling({ level, isAccordion }))}
      />
    );
  }

  return (
    <SideNavItem
      active={isSelectedTab(newUrl, slug)}
      aria-label={label}
      as={Link}
      contentSite={contentSite}
      to={newUrl}
      className={cx(l2ItemStyling({ level, isAccordion }))}
    >
      {label}
    </SideNavItem>
  );
}

function CollapsibleNavItem({ items, label, newUrl, slug, contentSite, isAccordion, level }) {
  const [isOpen, setIsOpen] = useState(isActiveTocNode(slug, newUrl, items));
  const caretType = isOpen ? 'CaretDown' : 'CaretUp';
  const isActive = isSelectedTab(newUrl, slug);

  const onCaretClick = (event) => {
    event.preventDefault();
    setIsOpen(!isOpen);
  };

  const handleClick = () => {
    // Allows the collapsed item if the caret was selected first before
    if (!(newUrl !== `/${slug}` && isOpen)) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <>
      <SideNavItem
        as={newUrl ? Link : 'a'}
        contentSite={contentSite}
        to={newUrl ? newUrl : null}
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
        items.map((item) => (
          <UnifiedTocNavItem
            {...item}
            level={level + 1}
            key={item.newUrl + item.label}
            slug={slug}
            isAccordion={isAccordion}
          />
        ))}
    </>
  );
}

export function StaticNavItem({
  label,
  newUrl,
  slug,
  items,
  contentSite,
  versionDropdown,
  setCurrentL1,
  isAccordion,
  setShowDriverBackBtn,
}) {
  const isActive = isActiveTocNode(slug, newUrl, items);

  return (
    <SideNavItem
      active={isActive}
      aria-label={label}
      contentSite={contentSite}
      hideExternalIcon={true}
      as={isUnifiedTOCInDevMode ? null : Link}
      to={newUrl}
      onClick={() => {
        setCurrentL1({ items, newUrl, versionDropdown, label });
        setShowDriverBackBtn(false);
      }}
      className={cx(l1ItemStyling({ isActive, isAccordion }))}
    >
      {label}
    </SideNavItem>
  );
}
