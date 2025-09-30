import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from '@gatsbyjs/reach-router';
import Box from '@leafygreen-ui/box';
import Icon from '@leafygreen-ui/icon';
import IconButton from '@leafygreen-ui/icon-button';
import { cx } from '@leafygreen-ui/emotion';
import { Body } from '@leafygreen-ui/typography';
import { HeadingContextProvider } from '../../context/heading-context';
import { findAllNestedAttribute } from '../../utils/find-all-nested-attribute';
import { OFFLINE_COLLAPSIBLE_CLASSNAME } from '../../utils/head-scripts/offline-ui/collapsible';
import { isBrowser } from '../../utils/is-browser';
import { isOfflineDocsBuild } from '../../utils/is-offline-docs-build';
import { reportAnalytics } from '../../utils/report-analytics';
import ComponentFactory from '../ComponentFactory';
import Heading from '../Heading';
import { CollapsibleNode, HeadingNode } from '../../types/ast';
import { collapsibleStyle, headerContainerStyle, headerStyle, iconStyle, innerContentStyle } from './styles';
import './styles.css';

interface CollapsibleProps {
  nodeData: CollapsibleNode;
  sectionDepth: number;
}
const Collapsible = ({ nodeData, sectionDepth, ...rest }: CollapsibleProps) => {
  const { children, options } = nodeData;
  const { id, heading, expanded, sub_heading: subHeading } = options || {};
  const { hash } = useLocation();

  // get a list of all ids in collapsible content
  // in order to set collapsible open, if any are found in url hash
  const childrenHashIds = useMemo(() => {
    return findAllNestedAttribute(children, 'id');
  }, [children]);

  const [open, setOpen] = useState(() => {
    if (isOfflineDocsBuild) return true;
    return expanded ?? true;
  });
  const headingNodeData: HeadingNode = {
    type: 'heading',
    depth: sectionDepth + 1,
    title: '',
    id: id ?? '',
    children: [{ type: 'text', value: heading ?? '' }],
    selector_ids: {},
  };

  const onIconClick = useCallback(() => {
    reportAnalytics('Click', {
      properties: {
        position: 'collapsible',
        position_context: `action: ${open ? 'collapsed' : 'expanded'}`,
        label: `heading: ${heading}`,
        label_text_displayed: `heading: ${heading}`,
        scroll_position: '0',
      },
    });
    setOpen(!open);
  }, [heading, open]);

  // open the collapsible if the hash in URL is equal to collapsible heading id,
  // or if the collapsible's children has the id
  useEffect(() => {
    if (!isBrowser) {
      return;
    }
    const hashId = hash?.slice(1) ?? '';
    if (id === hashId || childrenHashIds.includes(hashId)) {
      return setOpen(true);
    }
  }, [childrenHashIds, hash, id]);

  const rendered = useRef(false);

  // on first open, scroll the child with the URL hash id into view
  useEffect(() => {
    if (!open) return;
    if (rendered.current) return;
    rendered.current = true;
    const hashId = hash?.slice(1) ?? '';
    if (childrenHashIds.includes(hashId)) {
      const child = document?.querySelector(`#${hashId}`);
      child && child.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'smooth' });
    }
  }, [childrenHashIds, hash, open]);

  return (
    <HeadingContextProvider ignoreNextHeading={true} heading={heading}>
      <Box
        aria-expanded={open}
        className={cx('collapsible', collapsibleStyle, isOfflineDocsBuild ? OFFLINE_COLLAPSIBLE_CLASSNAME : '')}
      >
        <Box className={cx(headerContainerStyle)}>
          <Box>
            {/* Adding 1 to reflect logic in parser, but want to show up as H2 for SEO reasons */}
            <Heading className={cx(headerStyle)} sectionDepth={sectionDepth + 1} as={2} nodeData={headingNodeData}>
              {heading}
            </Heading>
            <Body baseFontSize={13}>{subHeading}</Body>
          </Box>
          <IconButton
            className={iconStyle}
            aria-labelledby={'Expand the collapsed content'}
            aria-expanded={open}
            onClick={onIconClick}
          >
            <Icon glyph={open ? 'ChevronDown' : 'ChevronRight'} />
          </IconButton>
        </Box>
        <Box className={cx(innerContentStyle)}>
          {children.map((c, i) => (
            <ComponentFactory nodeData={c} key={i} sectionDepth={sectionDepth} {...rest}></ComponentFactory>
          ))}
        </Box>
      </Box>
    </HeadingContextProvider>
  );
};
export default Collapsible;
