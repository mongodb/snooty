import React from 'react';
import PropTypes from 'prop-types';
import tileStyles from '../styles/drivers-homepage-tiles.module.css';
import Card from '@leafygreen-ui/card';

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
import IconRust from '../../static/svg/icon-Rust';
import IconScala from '../../static/svg/icon-Scala';
import IconSwift from '../../static/svg/icon-Swift';

// does not take in any params because it is a hardcoded list
const EcosystemHomepageTiles = () => {
  return (
    <ul className={tileStyles.tileOuter}>
      <Card as="li" className={tileStyles.tile}>
        <IconC></IconC>
        <a href="https://docs.mongodb.com/ecosystem/drivers/c/">C</a>
      </Card>
      <Card as="li" className={tileStyles.tile}>
        <IconCpp></IconCpp>
        <a href="https://docs.mongodb.com/ecosystem/drivers/cxx/">C++</a>
      </Card>
      <Card as="li" className={tileStyles.tile}>
        <IconCsharp></IconCsharp>
        <a href="https://docs.mongodb.com/ecosystem/drivers/csharp/">C#</a>
      </Card>

      <Card as="li" className={tileStyles.tile}>
        <IconGo></IconGo>
        <a href="https://docs.mongodb.com/ecosystem/drivers/go/">Go</a>
      </Card>
      <Card as="li" className={tileStyles.tile}>
        <IconJava></IconJava>
        <a href="https://docs.mongodb.com/ecosystem/drivers/java/">Java</a>
      </Card>
      <Card as="li" className={tileStyles.tile}>
        <IconNode></IconNode>
        <a href="https://docs.mongodb.com/ecosystem/drivers/node/">Node.js</a>
      </Card>

      <Card as="li" className={tileStyles.tile}>
        <IconRust></IconRust>
        <a href="https://docs.mongodb.com/ecosystem/drivers/perl/">Perl</a>
      </Card>
      <Card as="li" className={tileStyles.tile}>
        <IconPHP></IconPHP>
        <a href="https://docs.mongodb.com/ecosystem/drivers/php/">PHP</a>
      </Card>
      <Card as="li" className={tileStyles.tile}>
        <IconPython></IconPython>
        <a href="https://docs.mongodb.com/ecosystem/drivers/python/">Python</a>
      </Card>

      <Card as="li" className={tileStyles.tile}>
        <IconRuby></IconRuby>
        <a href="https://docs.mongodb.com/ruby-driver/current/">Ruby</a>
      </Card>
      <Card as="li" className={tileStyles.tile}>
        <IconScala></IconScala>
        <a href="https://docs.mongodb.com/ecosystem/drivers/scala/">Scala</a>
      </Card>
      <Card as="li" className={tileStyles.tile}>
        <IconSwift></IconSwift>
        <a href="https://docs.mongodb.com/ecosystem/drivers/swift/">Swift</a>
      </Card>
    </ul>
  );
};

export default EcosystemHomepageTiles;
