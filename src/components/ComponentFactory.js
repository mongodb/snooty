import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ADMONITIONS } from '../constants';
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
import URIWriter from './URIWriter/URIWriter';
import TitleReference from './TitleReference';

import RoleApi from './Roles/Api';
import RoleClass from './Roles/Class';
import RoleCode from './Roles/Code';
import RoleDoc from './Roles/Doc';
import RoleGUILabel from './Roles/GUILabel';
import RoleManual from './Roles/Manual';
import RoleProgram from './Roles/Program';
import RoleRef from './Roles/Ref';
import RoleTerm from './Roles/Term';

export default class ComponentFactory extends Component {
  constructor() {
    super();
    this.roles = {
      authrole: RoleCode,
      binary: RoleCode,
      class: RoleClass,
      'csharp-api': RoleApi,
      dbcommand: RoleCode,
      doc: RoleDoc,
      guilabel: RoleGUILabel,
      'java-sync-api': RoleApi,
      manual: RoleManual,
      method: RoleCode,
      option: RoleCode,
      program: RoleProgram,
      query: RoleCode,
      ref: RoleRef,
      setting: RoleCode,
      term: RoleTerm,
      update: RoleCode,
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
      title_reference: TitleReference,
      uriwriter: URIWriter,
    };
  }

  selectComponent() {
    const {
      nodeData: { children, name, type },
      ...rest
    } = this.props;
    // do nothing with these nodes for now (cc. Andrew)
    if (
      type === 'target' ||
      type === 'class' ||
      type === 'cssclass' ||
      name === 'cssclass' ||
      name === 'class' ||
      type === 'comment' ||
      name === 'default-domain'
    ) {
      return null;
    }

    if (type === 'problematic') {
      return <ComponentFactory nodeData={children[0]} {...rest} />;
    }

    const lookup = type === 'directive' ? name : type;
    let ComponentType = this.componentMap[lookup];
    // roles are each in separate file
    if (type === 'role') {
      // remove namespace
      const roleName = name.includes(':') ? name.split(':')[1] : name;
      ComponentType = this.roles[roleName];
    }
    // the different admonition types are all under the Admonition component
    // see 'this.admonitions' in 'guide.js' for the list
    if (!ComponentType && ADMONITIONS.includes(name)) {
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
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object),
    name: PropTypes.string,
    type: PropTypes.string.isRequired,
  }).isRequired,
};
