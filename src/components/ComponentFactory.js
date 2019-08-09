import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ADMONITIONS } from '../constants';
import Step from './Step';
import Paragraph from './Paragraph';
import List from './List';
import ListItem from './ListItem';
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
import Text from './Text';
import DefinitionList from './DefinitionList';
import DefinitionListItem from './DefinitionListItem';
import Transition from './Transition';
import CSSClass from './CSSClass';
import SubstitutionReference from './SubstitutionReference';
import Line from './Line';
import LineBlock from './LineBlock';
import HorizontalList from './HorizontalList';
import VersionAdded from './VersionAdded';
import Container from './Container';
import Setting from './Setting';
import Data from './Data';

import RoleApi from './Roles/Api';
import RoleClass from './Roles/Class';
import RoleCode from './Roles/Code';
import RoleDoc from './Roles/Doc';
import RoleGUILabel from './Roles/GUILabel';
import RoleManual from './Roles/Manual';
import RoleProgram from './Roles/Program';
import RoleRef from './Roles/Ref';
import RoleTerm from './Roles/Term';

const IGNORED_NAMES = ['default-domain'];
const IGNORED_TYPES = ['comment', 'substitution_definition', 'target'];

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
      class: CSSClass,
      code: Code,
      container: Container,
      cssclass: CSSClass,
      data: Data,
      definitionList: DefinitionList,
      definitionListItem: DefinitionListItem,
      emphasis: Emphasis,
      figure: Figure,
      heading: Heading,
      hlist: HorizontalList,
      include: Include,
      line: Line,
      line_block: LineBlock,
      list: List,
      listItem: ListItem,
      'list-table': ListTable,
      literal: Literal,
      literalinclude: LiteralInclude,
      paragraph: Paragraph,
      reference: Reference,
      section: Section,
      setting: Setting,
      step: Step,
      strong: Strong,
      substitution_reference: SubstitutionReference,
      tabs: Tabs,
      text: Text,
      title_reference: TitleReference,
      transition: Transition,
      uriwriter: URIWriter,
      versionadded: VersionAdded,
    };
  }

  selectComponent() {
    const {
      nodeData: { children, name, type },
      ...rest
    } = this.props;

    // do nothing with these nodes for now (cc. Andrew)
    if (IGNORED_TYPES.includes(type) || IGNORED_NAMES.includes(name)) {
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
