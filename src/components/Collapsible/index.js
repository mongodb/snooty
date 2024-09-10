import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from '@gatsbyjs/reach-router';
import Box from '@leafygreen-ui/box';
import Icon from '@leafygreen-ui/icon';
import IconButton from '@leafygreen-ui/icon-button';
import { cx } from '@leafygreen-ui/emotion';
import { Body } from '@leafygreen-ui/typography';
import { findAllNestedAttribute } from '../../utils/find-all-nested-attribute';
import { isBrowser } from '../../utils/is-browser';
import { reportAnalytics } from '../../utils/report-analytics';
import ComponentFactory from '../ComponentFactory';
import Heading from '../Heading';
import { collapsibleStyle, headerContainerStyle, headerStyle, iconStyle, innerContentStyle } from './styles';
import './styles.css';

const Collapsible = ({ nodeData: { children, options }, ...rest }) => {
  const { id, heading, sub_heading: subHeading } = options;
  const { hash } = useLocation();

  // get a list of all ids in collapsible content
  // in order to set collapsible open, if any are found in url hash
  const childrenHashIds = useMemo(() => {
    return findAllNestedAttribute(children, 'id');
  }, [children]);

  // Below would be preferred, but cannot be used if using
  // SSG + hydration. (possible with SSG + client side render)
  // const [open, setOpen] = useState(() => {
  //   const hashId = hash?.slice(1) ?? '';
  //   return id === hashId || childrenHashIds.includes(hashId);
  // });

  const [open, setOpen] = useState(() => false);
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

  useEffect(() => {
    if (!isBrowser) {
      return;
    }
    const hashId = hash?.slice(1) ?? '';
    if (id === hashId) {
      return setOpen(true);
    }
    if (childrenHashIds.includes(hashId)) {
      const child = document?.querySelector(`#${hashId}`);
      setOpen(true);

      // this workaround is required since browser has already
      // tried to load and scroll into hash anchor, but
      // we are using useEffect to open collapsible
      const interval = setTimeout(() => {
        child && child.scrollIntoView();
      }, 500);

      return () => {
        clearTimeout(interval);
      };
    }
  }, [childrenHashIds, hash, id]);

  return (
    <Box className={cx('collapsible', collapsibleStyle)}>
      <Box className={cx(headerContainerStyle)}>
        <Box>
          <Heading className={cx(headerStyle)} sectionDepth={2} nodeData={headingNodeData}>
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
          <ComponentFactory nodeData={c} key={i} {...rest}></ComponentFactory>
        ))}
      </Box>
    </Box>
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
