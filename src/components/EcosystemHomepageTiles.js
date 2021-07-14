import React from 'react';
import tileStyles from '../styles/drivers-homepage-tiles.module.css';
import Card from '@leafygreen-ui/card';
import Link from './Link';

// language icons for tiles
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

// does not take in any params because it is a hardcoded list
const EcosystemHomepageTiles = () => {
  const tileValues = [
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
      slug: '/go/',
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

  return (
    <ul className={tileStyles.tileOuter}>
      {tileValues.map((element, index) => (
        <Link to={element.slug} className={tileStyles.tileAnchor}>
          <Card as="li" className={tileStyles.tile}>
            {element.icon}
            {element.title}
          </Card>
        </Link>
      ))}
    </ul>
  );
};

export default EcosystemHomepageTiles;
