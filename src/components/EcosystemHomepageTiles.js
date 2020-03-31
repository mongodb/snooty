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

// does not take in any params because it is a hardcoded list
const EcosystemHomepageTiles = () => {
  const tileValues = [
    {
      slug: '/drivers/c/',
      title: 'C',
      icon: <IconC />,
    },
    {
      slug: '/drivers/cxx/',
      title: 'C++',
      icon: <IconCpp />,
    },
    {
      slug: '/drivers/csharp/',
      title: 'C#',
      icon: <IconCsharp />,
    },
    {
      slug: '/drivers/go/',
      title: 'Go',
      icon: <IconGo />,
    },
    {
      slug: '/drivers/java/',
      title: 'Java',
      icon: <IconJava />,
    },
    {
      slug: '/drivers/node/',
      title: 'Node.js',
      icon: <IconNode />,
    },
    {
      slug: '/drivers/perl/',
      title: 'Perl',
      icon: <IconPerl />,
    },
    {
      slug: '/drivers/php/',
      title: 'PHP',
      icon: <IconPHP />,
    },
    {
      slug: '/drivers/python/',
      title: 'Python',
      icon: <IconPython />,
    },
    {
      slug: '/ruby-driver/current/',
      title: 'Ruby',
      icon: <IconRuby />,
    },
    {
      slug: '/drivers/scala/',
      title: 'Scala',
      icon: <IconScala />,
    },
    {
      slug: '/drivers/swift/',
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
