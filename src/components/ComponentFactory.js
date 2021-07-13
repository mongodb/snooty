import React from 'react';
import PropTypes from 'prop-types';
import Admonition, { admonitionMap } from './Admonition';
import Banner from './Banner';
import BlockQuote from './BlockQuote';
import Button from './Button';
import Card from './Card';
import CardGroup from './CardGroup';
import Code from './Code';
import Cond from './Cond';
import Container from './Container';
import CSSClass from './CSSClass';
import CTA from './CTA';
import DefinitionList from './DefinitionList';
import DefinitionListItem from './DefinitionListItem';
import DeprecatedVersionSelector from './DeprecatedVersionSelector';
import Describe from './Describe';
import Emphasis from './Emphasis';
import Extract from './Extract';
import Field from './Field';
import FieldList from './FieldList';
import Figure from './Figure';
import Footnote from './Footnote';
import FootnoteReference from './FootnoteReference';
import Glossary from './Glossary';
import Heading from './Heading';
import HorizontalList from './HorizontalList';
import Image from './Image';
import Include from './Include';
import Introduction from './Introduction';
import Kicker from './Kicker';
import Line from './Line';
import LineBlock from './LineBlock';
import List from './List';
import ListItem from './ListItem';
import ListTable from './ListTable';
import Literal from './Literal';
import LiteralBlock from './LiteralBlock';
import LiteralInclude from './LiteralInclude';
import Meta from './Meta';
import MongoWebShell from './MongoWebShell';
import OpenAPI from './OpenAPI';
import Operation from './Operation';
import Paragraph from './Paragraph';
import Procedure from './Procedure';
import QuizWidget from './QuizWidget';
import Reference from './Reference';
import RefRole from './RefRole';
import ReleaseSpecification from './ReleaseSpecification';
import Root from './Root';
import Rubric from './Rubric';
import SearchResults from './SearchResults';
import Section from './Section';
import Step from './Step';
import StepsYAML from './StepsYAML';
import StepYAML from './StepYAML';
import Strong from './Strong';
import Subscript from './Subscript';
import SubstitutionReference from './SubstitutionReference';
import Superscript from './Superscript';
import Tabs from './Tabs';
import Target from './Target';
import Text from './Text';
import TitleReference from './TitleReference';
import Topic from './Topic';
import Transition from './Transition';
import Twitter from './Twitter';
import URIWriter from './URIWriter/URIWriter';
import VersionModified from './VersionModified';

import RoleAbbr from './Roles/Abbr';
import RoleClass from './Roles/Class';
import RoleCommand from './Roles/Command';
import RoleFile from './Roles/File';
import RoleGUILabel from './Roles/GUILabel';
import RoleHighlight from './Roles/Highlight';
import RoleIcon from './Roles/Icon';
import RoleKbd from './Roles/Kbd';
import RoleRed from './Roles/Red';
import RoleRequired from './Roles/Required';

const IGNORED_NAMES = new Set([
  'contents',
  'default-domain',
  'raw',
  'toctree',
  'tabs-pillstrip',
  'tabs-selector',
  'ia',
  'entry',
]);
const IGNORED_TYPES = new Set(['comment', 'substitution_definition', 'inline_target', 'named_reference']);
const DEPRECATED_ADMONITIONS = new Set(['admonition', 'topic', 'caution', 'danger']);

const roleMap = {
  abbr: RoleAbbr,
  class: RoleClass,
  command: RoleCommand,
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
  banner: Banner,
  blockquote: BlockQuote,
  button: Button,
  card: Card,
  'card-group': CardGroup,
  class: CSSClass,
  code: QuizWidget,
  cond: Cond,
  container: Container,
  cssclass: CSSClass,
  cta: CTA,
  definitionList: DefinitionList,
  definitionListItem: DefinitionListItem,
  deprecated: VersionModified,
  'deprecated-version-selector': DeprecatedVersionSelector,
  describe: Describe,
  emphasis: Emphasis,
  extract: Extract,
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
  introduction: Introduction,
  kicker: Kicker,
  line: Line,
  line_block: LineBlock,
  list: List,
  listItem: ListItem,
  'list-table': ListTable,
  literal: Literal,
  literal_block: LiteralBlock,
  literalinclude: LiteralInclude,
  meta: Meta,
  'mongo-web-shell': MongoWebShell,
  only: Cond,
  openapi: OpenAPI,
  operation: Operation,
  paragraph: Paragraph,
  procedure: Procedure,
  quiz: QuizWidget,
  ref_role: RefRole,
  reference: Reference,
  release_specification: ReleaseSpecification,
  root: Root,
  rubric: Rubric,
  'search-results': SearchResults,
  section: Section,
  step: Step,
  'step-yaml': StepYAML,
  'steps-yaml': StepsYAML,
  strong: Strong,
  substitution_reference: SubstitutionReference,
  tabs: Tabs,
  target: Target,
  text: Text,
  title_reference: TitleReference,
  topic: Topic,
  transition: Transition,
  twitter: Twitter,
  uriwriter: URIWriter,
  versionadded: VersionModified,
  versionchanged: VersionModified,
};

const ComponentFactory = (props) => {
  const { nodeData, slug } = props;

  const selectComponent = () => {
    const { domain, name, type } = nodeData;

    if (IGNORED_TYPES.has(type) || IGNORED_NAMES.has(name)) {
      return null;
    }

    // Warn on unexpected usage of domains, but don't break
    const validDomains = ['mongodb', 'std'];
    if (domain && !validDomains.includes(domain)) {
      console.warn(`Domain '${domain}' not yet implemented ${name ? `for '${name}'` : ''}`);
    }

    const lookup = type === 'directive' ? name : type;
    let ComponentType = componentMap[lookup];

    if (type === 'role') {
      ComponentType = roleMap[name];
    }

    // Various admonition types are all handled by the Admonition component
    if (DEPRECATED_ADMONITIONS.has(name) || name in admonitionMap) {
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
