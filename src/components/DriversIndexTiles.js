import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../theme/docsTheme';
import LeafyGreenCard from '@leafygreen-ui/card';

import IconC from './icons/C';
import IconCpp from './icons/Cpp';
import IconCsharp from './icons/Csharp';
import IconGo from './icons/Go';
import IconJava from './icons/Java';
import IconNode from './icons/Node';
import IconPHP from './icons/Php';
import IconPython from './icons/Python';
import IconRuby from './icons/Ruby';
import IconScala from './icons/Scala';
import IconSwift from './icons/Swift';
import IconRust from './icons/Rust';

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
    slug: 'https://docs.mongodb.com/drivers/go/current/',
    title: 'Go',
    icon: <IconGo />,
  },
  {
    slug: '/java-drivers/',
    title: 'Java',
    icon: <IconJava />,
  },
  {
    slug: 'https://docs.mongodb.com/drivers/node/current/',
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
    slug: 'https://docs.mongodb.com/ruby-driver/current/',
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
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: ${theme.size.default};
  grid-row-gap: ${theme.size.default};
`;

const StyledCard = styled(LeafyGreenCard)`
  display: flex;
  flex-direction: row;
  height: 100%;
  padding: ${theme.size.default};
`;

const StyledIcon = styled('div')`
  display: block;
  margin-right: ${theme.size.default};
  max-height: ${theme.size.medium};
  max-width: ${theme.size.medium};
`;

const DriversIndexTiles = () => {
  return (
    <StyledGrid>
      {tiles.map((t) => (
        <StyledCard as="a" contentStyle="clickable" key={t.title}>
          <StyledIcon>{t.icon}</StyledIcon>
          {t.title}
        </StyledCard>
      ))}
    </StyledGrid>
  );
};

export default DriversIndexTiles;
