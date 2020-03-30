import React from 'react';
import tileStyles from '../styles/drivers-homepage-tiles.module.css';
import Card from '@leafygreen-ui/card';
import Link from './Link';

// language icons for tiles
import IconC from '../../static/svg/icon-C';
import IconCpp from '../../static/svg/icon-Cpp';
import IconCsharp from '../../static/svg/icon-Csharp';
import IconGo from '../../static/svg/icon-Go';
import IconJava from '../../static/svg/icon-Java';
import IconNode from '../../static/svg/icon-Node';
import IconPHP from '../../static/svg/icon-PHP';
import IconPython from '../../static/svg/icon-Python';
import IconRuby from '../../static/svg/icon-Ruby';
import IconPerl from '../../static/svg/icon-Perl';
import IconScala from '../../static/svg/icon-Scala';
import IconSwift from '../../static/svg/icon-Swift';

// does not take in any params because it is a hardcoded list
const EcosystemHomepageTiles = () => {
  const tileValues = [
    {
      href: 'https://docs.mongodb.com/ecosystem/drivers/c/',
      title: 'C',
      icon: <IconC />,
    },
    {
      href: 'https://docs.mongodb.com/ecosystem/drivers/cxx/',
      title: 'C++',
      icon: <IconCpp />,
    },
    {
      href: 'https://docs.mongodb.com/ecosystem/drivers/csharp/',
      title: 'C#',
      icon: <IconCsharp />,
    },
    {
      href: 'https://docs.mongodb.com/ecosystem/drivers/go/',
      title: 'Go',
      icon: <IconGo />,
    },
    {
      href: 'https://docs.mongodb.com/ecosystem/drivers/java/',
      title: 'Java',
      icon: <IconJava />,
    },
    {
      href: 'https://docs.mongodb.com/ecosystem/drivers/node/',
      title: 'Node.js',
      icon: <IconNode />,
    },
    {
      href: 'https://docs.mongodb.com/ecosystem/drivers/perl/',
      title: 'Perl',
      icon: <IconPerl />,
    },
    {
      href: 'https://docs.mongodb.com/ecosystem/drivers/php/',
      title: 'PHP',
      icon: <IconPHP />,
    },
    {
      href: 'https://docs.mongodb.com/ecosystem/drivers/python/',
      title: 'Python',
      icon: <IconPython />,
    },
    {
      href: 'https://docs.mongodb.com/ecosystem/drivers/ruby/',
      title: 'Ruby',
      icon: <IconRuby />,
    },
    {
      href: 'https://docs.mongodb.com/ecosystem/drivers/scala/',
      title: 'Scala',
      icon: <IconScala />,
    },
    {
      href: 'https://docs.mongodb.com/ecosystem/drivers/swift/',
      title: 'Swift',
      icon: <IconSwift />,
    },
  ];

  return (
    <ul className={tileStyles.tileOuter}>
      {tileValues.map((element, index) => (
        <Link to={element.href} className={tileStyles.tileAnchor}>
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
