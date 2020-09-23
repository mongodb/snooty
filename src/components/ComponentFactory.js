import React from 'react';
import PropTypes from 'prop-types';
import { ComponentFactory as LandingComponentFactory } from './landing';
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
import Admonition, { admonitionMap } from './Admonition';
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
import Glossary from './Glossary';
import Rubric from './Rubric';
import SearchResults from './SearchResults';
import Field from './Field';
import FieldList from './FieldList';
import Operation from './Operation';
import OpenAPI from './OpenAPI';

import RoleAbbr from './Roles/Abbr';
import RoleClass from './Roles/Class';
import RoleFile from './Roles/File';
import RoleGUILabel from './Roles/GUILabel';
import RoleHighlight from './Roles/Highlight';
import RoleIcon from './Roles/Icon';
import RoleKbd from './Roles/Kbd';
import RoleRed from './Roles/Red';
import RoleRequired from './Roles/Required';

const IGNORED_NAMES = ['default-domain', 'raw', 'toctree'];
const IGNORED_TYPES = ['comment', 'substitution_definition', 'inline_target'];
const DEPRECATED_ADMONITIONS = ['admonition', 'topic', 'caution', 'danger'];

const roleMap = {
  abbr: RoleAbbr,
  class: RoleClass,
  file: RoleFile,
  guilabel: RoleGUILabel,
  icon: RoleIcon,
  'highlight-blue': RoleHighlight,
  'highlight-green': RoleHighlight,
  'highlight-red': RoleHighlight,
  'highlight-yellow': RoleHighlight,
  'icon-fa5': RoleIcon,
  'icon-fa5-brands': RoleIcon,
  'icon-fa4': RoleIcon,
  'icon-mms': RoleIcon,
  'icon-charts': RoleIcon,
  kbd: RoleKbd,
  red: RoleRed,
  required: RoleRequired,
  sub: Subscript,
  subscript: Subscript,
  sup: Superscript,
  superscript: Superscript,
};

const componentMap = {
  admonition: Admonition,
  blockquote: BlockQuote,
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
  field: Field,
  field_list: FieldList,
  figure: Figure,
  footnote: Footnote,
  footnote_reference: FootnoteReference,
  glossary: Glossary,
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
  openapi: OpenAPI,
  operation: Operation,
  paragraph: Paragraph,
  ref_role: RefRole,
  reference: Reference,
  rubric: Rubric,
  'search-results': SearchResults,
  section: Section,
  step: Step,
  strong: Strong,
  substitution_reference: SubstitutionReference,
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

const ComponentFactory = props => {
  const { nodeData, slug } = props;

  const selectComponent = () => {
    const { domain, name, type } = nodeData;

    if (IGNORED_TYPES.includes(type) || IGNORED_NAMES.includes(name)) {
      return null;
    }

    if (domain === 'landing') {
      return <LandingComponentFactory {...props} />;
    }

    const lookup = type === 'directive' ? name : type;
    let ComponentType = componentMap[lookup];

    if (type === 'role') {
      ComponentType = roleMap[name];
    }

    // Various admonition types are all handled by the Admonition component
    if (DEPRECATED_ADMONITIONS.includes(name) || Object.keys(admonitionMap).includes(name)) {
      ComponentType = componentMap.admonition;
    }

    if (!ComponentType) {
      console.warn(`${type} ${name ? `"${name}" ` : ''}not yet implemented${slug ? ` on page ${slug}` : ''}`);
      return null;
    }

    return <ComponentType {...props} />;
  };

  if (!nodeData) return null;
  return selectComponent();
};

ComponentFactory.propTypes = {
  nodeData: PropTypes.shape({
    domain: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string.isRequired,
  }).isRequired,
  slug: PropTypes.string,
};

export default ComponentFactory;
