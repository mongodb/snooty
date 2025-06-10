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
import VersionDropdown from '../VersionDropdown';
import { l1ItemStyling, groupHeaderStyling, l2ItemStyling } from './styles/SideNavItem';

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
`;

const caretStyle = LeafyCSS`
  margin-top: 3px;
`;

function isSelectedTab(url, slug) {
  return isSelectedTocNode(url, slug);
}

// This checks what sidenav should load based on the active Tab
export const isActiveTocNode = (currentUrl, slug, children) => {
  if (currentUrl === undefined) return false;
  if (isCurrentPage(currentUrl, slug)) return true;
  if (children) {
    return children.reduce((a, b) => a || isActiveTocNode(currentUrl, b.newUrl, b.items), false);
  }
  return false;
};

export function UnifiedTocNavItem({
  label,
  group,
  url,
  collapsible,
  items,
  isStatic,
  prefix,
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
            url={url}
            newUrl={newUrl}
            slug={slug}
            isStatic={isStatic}
            items={items}
            prefix={prefix}
            setCurrentL1={setCurrentL1}
            setShowDriverBackBtn={setShowDriverBackBtn}
            isAccordion={isAccordion}
          />
          {versionDropdown && <VersionDropdown />}
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
        {versionDropdown && <VersionDropdown />}
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
          {versionDropdown && <VersionDropdown />}
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
        as={Link}
        prefix={prefix}
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
        url={url}
        newUrl={newUrl}
        level={level}
        isAccordion={isAccordion}
        slug={slug}
        prefix={prefix}
        className={cx(l2ItemStyling({ level, isAccordion }))}
      />
    );
  }

  return (
    <SideNavItem
      active={isSelectedTab(newUrl, slug)}
      aria-label={label}
      as={Link}
      prefix={prefix}
      to={newUrl}
      className={cx(l2ItemStyling({ level, isAccordion }))}
    >
      {label}
    </SideNavItem>
  );
}

function CollapsibleNavItem({ items, label, url, newUrl, slug, prefix, isAccordion, level }) {
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
        as={Link}
        prefix={prefix}
        to={newUrl}
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
  url,
  newUrl,
  slug,
  items,
  isStatic,
  prefix,
  setCurrentL1,
  isAccordion,
  setShowDriverBackBtn,
  level = 1,
}) {
  const isActive = isActiveTocNode(slug, newUrl, items);
  console.log('ahhh', slug, newUrl, isActive);

  return (
    <SideNavItem
      active={isActive}
      aria-label={label}
      prefix={prefix}
      as={Link}
      to={newUrl}
      onClick={() => {
        setCurrentL1({ items, newUrl });
        setShowDriverBackBtn(false);
      }}
      className={cx(l1ItemStyling({ isActive, isAccordion }))}
    >
      {label}
    </SideNavItem>
  );
}
