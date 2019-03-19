import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Step from './Step';
import Paragraph from './Paragraph';
import List from './List';
import ListTable from './ListTable';
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
import Reference from './Reference';
import Strong from './Strong';
import URIWriter from './URIWriter';

export default class ComponentFactory extends Component {
  constructor() {
    super();
    this.componentMap = {
      admonition: Admonition,
      block_quote: BlockQuote,
      code: Code,
      emphasis: Emphasis,
      figure: Figure,
      heading: Heading,
      include: Include,
      list: List,
      'list-table': ListTable,
      literal: Literal,
      literalinclude: LiteralInclude,
      paragraph: Paragraph,
      reference: Reference,
      role: Role,
      section: Section,
      step: Step,
      strong: Strong,
      tabs: Tabs,
      uriwriter: URIWriter,
    };
  }

  selectComponent() {
    const {
      admonitions,
      nodeData: { name, type },
    } = this.props;
    // do nothing with these nodes for now (cc. Andrew)
    if (type === 'target' || type === 'class' || type === 'cssclass' || name === 'cssclass') {
      return null;
    }
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
