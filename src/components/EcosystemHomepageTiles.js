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

const EcosystemHomepageTiles = ({ nodeData, nodeData: { children }, ...rest }) => {
  return (
    <ul className={tileStyles.tileOuter}>
      <Card as="li" className={tileStyles.tile}>
        <IconC></IconC>
        <a href="#">C</a>
      </Card>
      <Card as="li" className={tileStyles.tile}>
        <IconCpp></IconCpp>
        <a href="#">C++</a>
      </Card>
      <Card as="li" className={tileStyles.tile}>
        <IconCsharp></IconCsharp>
        <a href="#">C#</a>
      </Card>

      <Card as="li" className={tileStyles.tile}>
        <IconGo></IconGo>
        <a href="#">Go</a>
      </Card>
      <Card as="li" className={tileStyles.tile}>
        <IconJava></IconJava>
        <a href="#">Java</a>
      </Card>
      <Card as="li" className={tileStyles.tile}>
        <IconNode></IconNode>
        <a href="#">Node.js</a>
      </Card>

      <Card as="li" className={tileStyles.tile}>
        <IconPHP></IconPHP>
        <a href="#">PHP</a>
      </Card>
      <Card as="li" className={tileStyles.tile}>
        <IconPython></IconPython>
        <a href="#">Python</a>
      </Card>
      <Card as="li" className={tileStyles.tile}>
        <IconRuby></IconRuby>
        <a href="#">Ruby</a>
      </Card>

      <Card as="li" className={tileStyles.tile}>
        <IconRust></IconRust>
        <a href="#">Rust</a>
      </Card>
      <Card as="li" className={tileStyles.tile}>
        <IconScala></IconScala>
        <a href="#">Scala</a>
      </Card>
      <Card as="li" className={tileStyles.tile}>
        <IconSwift></IconSwift>
        <a href="#">Swift</a>
      </Card>
    </ul>
  );
};

EcosystemHomepageTiles.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.array.isRequired,
    options: PropTypes.shape({
      align: PropTypes.string,
      class: PropTypes.string,
      'header-rows': PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      'stub-columns': PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      width: PropTypes.string,
      widths: PropTypes.string,
    }),
  }).isRequired,
};

export default EcosystemHomepageTiles;
