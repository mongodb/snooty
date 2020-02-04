import React from 'react';
import styled from '@emotion/styled';
import { P } from './text';
import { colorMap, fontSize, size } from './theme';

/* TODO: Update font once decided */
const BadgeText = styled(P)`
  background: ${colorMap.greyDarkThree};
  font-size: ${fontSize.xsmall};
  font-weight: bold;
  letter-spacing: 1px;
  padding: ${size.tiny} ${size.small};
  ${({ textColor }) => textColor && `color: ${textColor};`}
  text-transform: uppercase;
  width: fit-content;
`;

const badgeTypeColorMap = {
  Article: colorMap.salmon,
  Community: colorMap.magenta,
  'Deep Dive': colorMap.teal,
  Event: colorMap.orange,
  'How-To': colorMap.yellow,
  'Quick Start': colorMap.lightGreen,
};

const Badge = ({ children }) => <BadgeText textColor={badgeTypeColorMap[children]}>{children}</BadgeText>;

export default Badge;
