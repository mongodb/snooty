import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from '@gatsbyjs/reach-router';
import Box from '@leafygreen-ui/box';
import Icon from '@leafygreen-ui/icon';
import IconButton from '@leafygreen-ui/icon-button';
import { cx } from '@leafygreen-ui/emotion';
import { Body } from '@leafygreen-ui/typography';
import { HeadingContextProvider } from '../../context/heading-context';
import { findAllNestedAttribute } from '../../utils/find-all-nested-attribute';
import { isBrowser } from '../../utils/is-browser';
import { reportAnalytics } from '../../utils/report-analytics';
import ComponentFactory from '../ComponentFactory';
import Heading from '../Heading';
import { collapsibleStyle, headerContainerStyle, headerStyle, iconStyle, innerContentStyle } from './styles';
import './styles.css';

const Collapsible = ({ nodeData: { children, options }, sectionDepth, ...rest }) => {
  const { id, heading, expanded, sub_heading: subHeading } = options;
  const { hash } = useLocation();

  // get a list of all ids in collapsible content
  // in order to set collapsible open, if any are found in url hash
  const childrenHashIds = useMemo(() => {
    return findAllNestedAttribute(children, 'id');
  }, [children]);

  const [open, setOpen] = useState(expanded ?? true);
  const headingNodeData = {
    id,
    children: [{ type: 'text', value: heading }],
  };

  const onIconClick = useCallback(() => {
    reportAnalytics('CollapsibleClicked', {
      action: open ? 'collapsed' : 'expanded',
      heading,
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
      <Box className={cx('collapsible', collapsibleStyle)}>
        <Box className={cx(headerContainerStyle)}>
          <Box>
            {/* Adding 1 to reflect logic in parser, but want to show up as H2 for SEO reasons */}
            <Heading className={cx(headerStyle)} sectionDepth={sectionDepth + 1} as={2} nodeData={headingNodeData}>
              {heading}
            </Heading>
            <Body baseFontSize={13}>{subHeading}</Body>
          </Box>
          <IconButton className={iconStyle} aria-labelledby={'Expand the collapsed content'} onClick={onIconClick}>
            <Icon glyph={open ? 'ChevronDown' : 'ChevronRight'} />
          </IconButton>
        </Box>
        <Box className={cx(innerContentStyle(open))}>
          {children.map((c, i) => (
            <ComponentFactory nodeData={c} key={i} sectionDepth={sectionDepth} {...rest}></ComponentFactory>
          ))}
        </Box>
      </Box>
    </HeadingContextProvider>
  );
};

Collapsible.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object),
    options: PropTypes.shape({
      heading: PropTypes.string.isRequired,
      sub_heading: PropTypes.string,
      id: PropTypes.string,
    }),
  }),
};

export default Collapsible;
