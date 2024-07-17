import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@leafygreen-ui/box';
import Icon from '@leafygreen-ui/icon';
import IconButton from '@leafygreen-ui/icon-button';
import { cx } from '@leafygreen-ui/emotion';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { Body } from '@leafygreen-ui/typography';
import ComponentFactory from '../ComponentFactory';
import Heading from '../Heading';
import { collapsibleStyle, headerContainerStyle, headerStyle, iconStyle, innerContentStyle } from './styles';
import './styles.css';

// Collapsible component that contains:
// options.heading        @str        (req)
// options.sub_heading    @str
// nodeData.children      nodeData[]
const Collapsible = ({ nodeData: { children, options }, ...rest }) => {
  const { darkMode } = useDarkMode();
  const { id, heading, sub_heading: subHeading } = options;
  const [open, setOpen] = useState(false);
  const headingNodeData = useMemo(
    () => ({
      id,
      children: [{ type: 'text', value: heading }],
    }),
    [heading, id]
  );

  return (
    <Box className={cx('collapsible', collapsibleStyle)}>
      <Box className={cx(headerContainerStyle)}>
        <Box>
          <Heading className={cx(headerStyle)} sectionDepth={2} nodeData={headingNodeData}>
            {heading}
          </Heading>
          <Body baseFontSize={13}>{subHeading}</Body>
        </Box>
        <IconButton
          className={iconStyle(darkMode)}
          aria-labelledby={'Expand the collapsed content'}
          onClick={() => setOpen(!open)}
        >
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
