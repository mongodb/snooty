import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Step from './Step';
import Paragraph from './Paragraph';
import List from './List';
import ListTable from './ListTable';
import Emphasis from './Emphasis';
import Include from './Include';
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

// the different roles
import RoleGUILabel from './Roles/GUILabel';
import RoleProgram from './Roles/Program';
import RoleLink from './Roles/Link';
import RoleRef from './Roles/Ref';
import RoleCode from './Roles/Code';

export default class ComponentFactory extends Component {
  constructor() {
    super();
    this.roles = {
      authrole: RoleCode,
      binary: RoleCode,
      dbcommand: RoleCode,
      doc: RoleLink,
      guilabel: RoleGUILabel,
      manual: RoleLink,
      method: RoleCode,
      option: RoleCode,
      program: RoleProgram,
      query: RoleCode,
      ref: RoleRef,
      setting: RoleCode,
      term: RoleLink,
    };
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
    if (type === 'target' || type === 'class' || type === 'cssclass' || name === 'cssclass' || name === 'class') {
      return null;
    }
    const lookup = type === 'directive' ? name : type;
    let ComponentType = this.componentMap[lookup];
    // roles are each in separate file
    if (type === 'role') {
      // remove namespace
      let modName = name;
      if (modName.includes(':')) {
        const splitNames = modName.split(':');
        modName = splitNames[1];
      }
      ComponentType = this.roles[modName];
    }
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
