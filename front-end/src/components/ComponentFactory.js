import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Step from './Step';
import Paragraph from './Paragraph';
import List from './List';
import Emphasis from './Emphasis';
import Include from './Include';
import Role from './Role';
import Section from './Section';
import Code from './Code';
import LiteralInclude from './LiteralInclude';
import Tabs from './Tabs';
import Admonition from './Admonition';
import Figure from './Figure';
import Literal from './Literal';
import Heading from './Heading';
import BlockQuote from './BlockQuote';

export default class ComponentFactory extends Component {
  constructor() {
    super();
    this.componentMap = {
      step: Step,
      paragraph: Paragraph,
      list: List,
      emphasis: Emphasis,
      include: Include,
      role: Role,
      section: Section,
      code: Code,
      literalinclude: LiteralInclude,
      tabs: Tabs,
      admonition: Admonition,
      figure: Figure,
      literal: Literal,
      heading: Heading,
      block_quote: BlockQuote,
    };
  }

  selectComponent() {
    const {
      admonitions,
      nodeData: { name, type },
    } = this.props;
    const lookup = type === 'directive' ? name : type;
    let ComponentType = this.componentMap[lookup];
    // the different admonition types are all under the Admonition component
    // see 'this.admonitions' in 'guide.js' for the list
    if (!ComponentType && admonitions && admonitions.includes(name)) {
      ComponentType = this.componentMap.admonition;
    }
    // component with this type not implemented
    if (!ComponentType) {
      return (
        <span>
          ==Not implemented:
          {type},{name} ==
        </span>
      );
    }
    return <ComponentType {...this.props} />;
  }

  render() {
    return this.selectComponent();
  }
}

ComponentFactory.propTypes = {
  admonitions: PropTypes.arrayOf(PropTypes.string),
  nodeData: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string.isRequired,
  }).isRequired,
};

ComponentFactory.defaultProps = {
  admonitions: undefined,
};
