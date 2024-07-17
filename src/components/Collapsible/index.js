import React, { useMemo, useState } from 'react';
import Box from '@leafygreen-ui/box';
import { Body } from '@leafygreen-ui/typography';
import Icon from '@leafygreen-ui/icon';
import { cx } from '@leafygreen-ui/emotion';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import ComponentFactory from '../ComponentFactory';
import Heading from '../Heading';
import { collapsibleStyle, headerContainerStyle, headerStyle, iconStyle, innerContentStyle } from './styles';

// Collapsible component that contains
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
    <Box className={cx(collapsibleStyle)}>
      <Box className={cx(headerContainerStyle)}>
        <Box>
          <Heading className={cx(headerStyle)} sectionDepth={2} nodeData={headingNodeData}>
            {heading}
          </Heading>
          <Body baseFontSize={13}>{subHeading}</Body>
        </Box>
        <Icon
          className={cx(iconStyle(darkMode))}
          glyph={open ? 'ChevronDown' : 'ChevronRight'}
          onClick={() => setOpen(!open)}
        />
      </Box>
      <Box className={cx(innerContentStyle(open))}>
        {children.map((c, i) => (
          <ComponentFactory nodeData={c} key={i} {...rest}></ComponentFactory>
        ))}
      </Box>
    </Box>
  );
};

Collapsible.propTypes = {};

export default Collapsible;
