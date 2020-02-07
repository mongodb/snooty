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
import Contents from './Contents';
import Container from './Container';
import Cond from './Cond';
import Meta from './Meta';
import TabsPillstrip from './TabsPillstrip';
import VersionChanged from './VersionChanged';
import VersionAdded from './VersionAdded';
import Deprecated from './Deprecated';
import CardGroup from './CardGroup';
import Footnote from './Footnote';
import FootnoteReference from './FootnoteReference';
import LiteralBlock from './LiteralBlock';
import Topic from './Topic';
import Subscript from './Subscript';
import Superscript from './Superscript';
import Image from './Image';
import RefRole from './RefRole';
import Target from './Target';

import RoleAbbr from './Roles/Abbr';
import RoleClass from './Roles/Class';
import RoleDoc from './Roles/Doc';
import RoleFile from './Roles/File';
import RoleGUILabel from './Roles/GUILabel';
import RoleProgram from './Roles/Program';

const IGNORED_NAMES = ['default-domain'];
const IGNORED_TYPES = ['comment', 'substitution_definition'];

export default class ComponentFactory extends Component {
  constructor() {
    super();
    this.roles = {
      abbr: RoleAbbr,
      class: RoleClass,
      doc: RoleDoc,
      file: RoleFile,
      guilabel: RoleGUILabel,
      program: RoleProgram,
    };
    this.componentMap = {
      admonition: Admonition,
      block_quote: BlockQuote,
      'card-group': CardGroup,
      class: CSSClass,
      code: Code,
      cond: Cond,
      container: Container,
      contents: Contents,
      cssclass: CSSClass,
      definitionList: DefinitionList,
      definitionListItem: DefinitionListItem,
      deprecated: Deprecated,
      emphasis: Emphasis,
      figure: Figure,
      footnote: Footnote,
      footnote_reference: FootnoteReference,
      heading: Heading,
      hlist: HorizontalList,
      image: Image,
      include: Include,
      line: Line,
      line_block: LineBlock,
      list: List,
      listItem: ListItem,
      'list-table': ListTable,
      literal: Literal,
      literal_block: LiteralBlock,
      literalinclude: LiteralInclude,
      meta: Meta,
      only: Cond,
      paragraph: Paragraph,
      ref_role: RefRole,
      reference: Reference,
      section: Section,
      step: Step,
      strong: Strong,
      subscript: Subscript,
      substitution_reference: SubstitutionReference,
      superscript: Superscript,
      tabs: Tabs,
      'tabs-pillstrip': TabsPillstrip,
      target: Target,
      text: Text,
      title_reference: TitleReference,
      topic: Topic,
      transition: Transition,
      uriwriter: URIWriter,
      versionadded: VersionAdded,
      versionchanged: VersionChanged,
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
    const { nodeData } = this.props;
    if (!nodeData) return null;
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
