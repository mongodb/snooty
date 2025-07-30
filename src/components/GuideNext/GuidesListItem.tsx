import React, { useContext } from 'react';
import { css } from '@leafygreen-ui/emotion';
import styled from '@emotion/styled';
import Icon from '@leafygreen-ui/icon';
import { palette } from '@leafygreen-ui/palette';
import IconLightningBolt from '../icons/LightningBolt';
import Link from '../Link';
import { theme } from '../../theme/docsTheme';
import { ReadGuidesContext } from './read-guides-context';

const CIRCLE_SIZE = 20;

const ListItem = styled('li')`
  align-items: flex-start;
  display: flex;
  min-height: 40px;
  padding-top: 0 !important;
  position: relative;

  &:not(:last-child) {
    padding-bottom: ${theme.size.default};

    :before {
      content: '';
      position: absolute;
      left: ${CIRCLE_SIZE / 2}px;
      top: ${CIRCLE_SIZE}px;
      height: calc(100% - ${CIRCLE_SIZE}px);
      border-left: solid 1px ${({ color }) => color};
    }
  }
`;

const Circle = styled('div')`
  align-items: center;
  border-radius: 50%;
  border: solid 1px ${({ color }) => color};
  display: flex;
  justify-content: center;
  margin-right: 12px;
  min-width: ${CIRCLE_SIZE}px;
  min-height: ${CIRCLE_SIZE}px;
`;

const GuideTitle = styled(Link)`
  color: ${palette.black};
  .dark-theme & {
    color: ${palette.gray.light2};
  }

  text-decoration: none;

  :hover,
  :active {
    color: currentColor;
    text-decoration: none;
  }
`;

const STATUSES = {
  next: {
    circleColor: palette.green.dark1,
    icon: (
      <IconLightningBolt
        className={css`
          color: ${palette.green.dark1};
        `}
      />
    ),
    lineColor: palette.gray.light2,
  },
  read: {
    circleColor: 'transparent',
    icon: <Icon glyph="Checkmark" fill={palette.green.dark1} />,
    lineColor: palette.green.dark1,
  },
  unread: {
    circleColor: 'transparent',
    icon: (
      <IconLightningBolt
        className={css`
          color: ${palette.gray.dark2};
          .dark-theme & {
            color: ${palette.gray.light2};
          }
        `}
      />
    ),
    lineColor: palette.gray.light2,
  },
};

export type GuidesListItemProps = {
  children: React.ReactNode;
  isNext: boolean;
  slug: string;
};

const GuidesListItem = ({ children, isNext, slug }: GuidesListItemProps) => {
  const { readGuides } = useContext(ReadGuidesContext);

  let status = isNext ? 'next' : 'unread';
  if (readGuides[slug as keyof typeof readGuides]) {
    status = 'read';
  }

  const activeStatus = STATUSES[status as keyof typeof STATUSES];

  return (
    <ListItem color={activeStatus.lineColor}>
      <Circle color={activeStatus.circleColor}>{activeStatus.icon}</Circle>
      <GuideTitle to={slug}>{children}</GuideTitle>
    </ListItem>
  );
};

export default GuidesListItem;
