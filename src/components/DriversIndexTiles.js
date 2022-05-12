import React from 'react';
import styled from '@emotion/styled';
import { uiColors } from '@leafygreen-ui/palette';
import LeafyGreenCard from '@leafygreen-ui/card';
import Link from './Link';
import { theme } from '../theme/docsTheme';
import { baseUrl } from '../utils/base-url';

import IconC from './icons/C';
import IconCpp from './icons/Cpp';
import IconCsharp from './icons/Csharp';
import IconGo from './icons/Go';
import IconJava from './icons/Java';
import IconNode from './icons/Node';
import IconPHP from './icons/Php';
import IconPython from './icons/Python';
import IconRuby from './icons/Ruby';
import IconRust from './icons/Rust';
import IconScala from './icons/Scala';
import IconSwift from './icons/Swift';

// DriversIndexTiles is used to display the drivers as Cards on drivers landing page

// TODO: Unhardcode this. Ideally, the SVG resources would just be plain SVG, not components
const tiles = [
  {
    slug: '/c/',
    title: 'C',
    icon: <IconC />,
  },
  {
    slug: '/cxx/',
    title: 'C++',
    icon: <IconCpp />,
  },
  {
    slug: '/csharp/',
    title: 'C#',
    icon: <IconCsharp />,
  },
  {
    slug: `${baseUrl()}/drivers/go/current/`,
    title: 'Go',
    icon: <IconGo />,
  },
  {
    slug: '/java-drivers/',
    title: 'Java',
    icon: <IconJava />,
  },
  {
    slug: `${baseUrl()}/drivers/node/current/`,
    title: 'Node.js',
    icon: <IconNode />,
  },
  {
    slug: '/php/',
    title: 'PHP',
    icon: <IconPHP />,
  },
  {
    slug: '/python/',
    title: 'Python',
    icon: <IconPython />,
  },
  {
    slug: `${baseUrl()}/ruby-driver/current/`,
    title: 'Ruby',
    icon: <IconRuby />,
  },
  {
    slug: '/rust/',
    title: 'Rust',
    icon: <IconRust />,
  },
  {
    slug: '/scala/',
    title: 'Scala',
    icon: <IconScala />,
  },
  {
    slug: '/swift/',
    title: 'Swift',
    icon: <IconSwift />,
  },
];

const StyledGrid = styled('div')`
  display: grid;
  grid-gap: ${theme.size.default};
  grid-template-columns: repeat(3, 1fr);

  @media ${theme.screenSize.upToMedium} {
    grid-gap: 12px;
    grid-template-columns: repeat(2, 1fr);
  }

  @media ${theme.screenSize.upToSmall} {
    grid-gap: ${theme.size.small};
    grid-template-columns: 1fr;
  }
`;

const StyledCard = styled(LeafyGreenCard)`
  border: 1px solid ${uiColors.gray.light2};
  box-shadow: none;
  display: flex;
  flex-direction: row;
  padding: ${theme.size.default};

  &:hover {
    box-shadow: 0 3px 6px -2px ${uiColors.gray.light1};
    color: unset;
    text-decoration: none;
  }
`;

const StyledIcon = styled('div')`
  display: block;
  margin-right: ${theme.size.default};

  & > svg {
    height: ${theme.size.medium};
    vertical-align: -7px;
    width: ${theme.size.medium};
  }
`;

const DriversIndexTiles = () => {
  return (
    <StyledGrid>
      {tiles.map((t) => (
        <StyledCard as={Link} contentStyle="clickable" key={t.title} to={t.slug}>
          <StyledIcon>{t.icon}</StyledIcon>
          {t.title}
        </StyledCard>
      ))}
    </StyledGrid>
  );
};

export default DriversIndexTiles;
