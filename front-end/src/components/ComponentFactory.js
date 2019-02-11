import React, { Component } from 'react';
import Step from '../components/Step';
import Paragraph from '../components/Paragraph';
import List from '../components/List';
import Emphasis from '../components/Emphasis';
import Include from '../components/Include';
import Role from '../components/Role';
import Section from '../components/Section';
import Code from '../components/Code';
import LiteralInclude from '../components/LiteralInclude';
import Tabs from '../components/Tabs';
import Admonition from '../components/Admonition';
import Figure from '../components/Figure';
import Literal from '../components/Literal';
import Heading from '../components/Heading';
import BlockQuote from '../components/BlockQuote';
import URIWriter from '../components/URIWriter';

export default class ComponentFactory extends Component {

  constructor() {
    super();
    this.componentMap = {
      'step': Step,
      'paragraph': Paragraph,
      'list': List,
      'emphasis': Emphasis,
      'include': Include,
      'role': Role,
      'section': Section,
      'code': Code,
      'literalinclude': LiteralInclude,
      'tabs': Tabs,
      'admonition': Admonition,
      'figure': Figure,
      'literal': Literal,
      'heading': Heading,
      'block_quote': BlockQuote,
      'uriwriter': URIWriter,
    };
  }

  selectComponent() {
    const type = this.props.nodeData.type;
    const name = this.props.nodeData.name;
    const lookup = (type === 'directive') ? name : type;
    let ComponentType = this.componentMap[lookup];
    // the different admonition types are all under the Admonition component
    // see 'this.admonitions' in 'guide.js' for the list
    if (!ComponentType && this.props.admonitions && this.props.admonitions.includes(name)) {
      ComponentType = this.componentMap['admonition'];
    }
    // component with this type not implemented
    if (!ComponentType) {
      return <span>==Not implemented: { type }, { name } ==</span>
    }
    return <ComponentType { ...this.props } />
  }

  render() {
    return this.selectComponent()
  }

}

