import React from 'react';
import tileStyles from '../styles/drivers-homepage-tiles.module.css';
import Card from '@leafygreen-ui/card';
import Link from './Link';

// language icons for tiles
import IconC from '../../static/svg/icons/icon-C';
import IconCpp from '../../static/svg/icons/icon-Cpp';
import IconCsharp from '../../static/svg/icons/icon-Csharp';
import IconGo from '../../static/svg/icons/icon-Go';
import IconJava from '../../static/svg/icons/icon-Java';
import IconNode from '../../static/svg/icons/icon-Node';
import IconPHP from '../../static/svg/icons/icon-PHP';
import IconPython from '../../static/svg/icons/icon-Python';
import IconRuby from '../../static/svg/icons/icon-Ruby';
import IconPerl from '../../static/svg/icons/icon-Perl';
import IconScala from '../../static/svg/icons/icon-Scala';
import IconSwift from '../../static/svg/icons/icon-Swift';
import IconRust from '../../static/svg/icons/icon-Rust';

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
      slug: '/java/',
      title: 'Java',
      icon: <IconJava />,
    },
    {
      slug: '/node/',
      title: 'Node.js',
      icon: <IconNode />,
    },
    {
      slug: '/perl/',
      title: 'Perl',
      icon: <IconPerl />,
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
      slug: '/ruby/',
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
