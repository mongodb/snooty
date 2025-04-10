import React from 'react';
import { Directive } from '../types/ast';

import { LAZY_COMPONENTS } from './ComponentFactoryLazy';

import Paragraph from './Paragraph';
import Procedure from './Procedure';
import Reference from './Reference';
import RefRole from './RefRole';
import ReleaseSpecification from './ReleaseSpecification';
import Root from './Root';
import Rubric from './Rubric';
import SearchResults from './SearchResults';
import Section from './Section';
import Strong from './Strong';
import Subscript from './Subscript';
import SubstitutionReference from './SubstitutionReference';
import Superscript from './Superscript';
import Tabs from './Tabs';
import TabSelectors from './Tabs/TabSelectors';
import Target from './Target';
import Text from './Text';
import Time from './Time';
import TitleReference from './TitleReference';
import Transition from './Transition';
import VersionModified from './VersionModified';
import { Wayfinding } from './Wayfinding';

import RoleAbbr from './Roles/Abbr';
import RoleClass from './Roles/Class';
import RoleCommand from './Roles/Command';
import RoleFile from './Roles/File';
import RoleGUILabel from './Roles/GUILabel';
import RoleHighlight from './Roles/Highlight';
import RoleIcon from './Roles/Icon';
import RoleKbd from './Roles/Kbd';
import RoleLinkNewTab from './Roles/LinkNewTab';
import RoleRed from './Roles/Red';
import RoleGold from './Roles/Gold';
import RoleRequired from './Roles/Required';
import SeeAlso from './SeeAlso';

const IGNORED_NAMES = new Set([
  'contents',
  'default-domain',
  'entry',
  'ia',
  'raw',
  'short-description',
  'tabs-pillstrip',
  'toctree',
  'meta',
  'facet',
]);
const IGNORED_TYPES = new Set(['comment', 'inline_target', 'named_reference', 'substitution_definition']);
const DEPRECATED_ADMONITIONS = new Set(['admonition', 'caution', 'danger']);

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
  'icon-lg': RoleIcon,
  kbd: RoleKbd,
  red: RoleRed,
  gold: RoleGold,
  required: RoleRequired,
  sub: Subscript,
  subscript: Subscript,
  sup: Superscript,
  superscript: Superscript,
  'link-new-tab': RoleLinkNewTab,
};

const componentMap = {
  admonition: Admonition,
  banner: Banner,
  blockquote: BlockQuote,
  button: Button,
  card: Card,
  'card-group': CardGroup,
  chapter: Chapter,
  chapters: Chapters,
  code: Code,
  collapsible: Collapsible,
  'community-driver': CommunityPillLink,
  'io-code-block': CodeIO,
  cond: Cond,
  container: Container,
  cta: CTA,
  'cta-banner': CTABanner,
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
  'guide-next': GuideNext,
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
  'method-selector': MethodSelector,
  only: Cond,
  'openapi-changelog': OpenAPIChangelog,
  paragraph: Paragraph,
  procedure: Procedure,
  ref_role: RefRole,
  reference: Reference,
  release_specification: ReleaseSpecification,
  root: Root,
  rubric: Rubric,
  'search-results': SearchResults,
  section: Section,
  seealso: SeeAlso,
  sharedinclude: Include,
  strong: Strong,
  substitution_reference: SubstitutionReference,
  tabs: Tabs,
  'tabs-selector': TabSelectors,
  target: Target,
  text: Text,
  time: Time,
  title_reference: TitleReference,
  transition: Transition,
  versionadded: VersionModified,
  versionchanged: VersionModified,
  wayfinding: Wayfinding,
};

function getComponentType(type, name) {
  const lookup = type === 'directive' ? name : type;
  let ComponentType = componentMap[lookup];

  if (type === 'role') {
    ComponentType = roleMap[name];
  }

  // Various admonition types are all handled by the Admonition component
  if (DEPRECATED_ADMONITIONS.has(name) || name in admonitionMap) {
    ComponentType = componentMap.admonition;
  }

  if (LAZY_COMPONENTS[lookup]) {
    return LAZY_COMPONENTS[lookup];
  }

  return ComponentType;
}

const ComponentFactory = (props) => {
  const { nodeData, slug } = props;

  const selectComponent = () => {
    const { domain, name, type } = nodeData;

    if (IGNORED_TYPES.has(type) || IGNORED_NAMES.has(name)) {
      return null;
    }

    // Warn on unexpected usage of domains, but don't break
    const validDomains = ['mongodb', 'std', 'landing'];
    if (domain && !validDomains.includes(domain)) {
      console.warn(`Domain '${domain}' not yet implemented ${name ? `for '${name}'` : ''}`);
    }

    const ComponentType = getComponentType(type, name);

    if (!ComponentType) {
      console.warn(`${type} ${name ? `"${name}" ` : ''}not yet implemented${slug ? ` on page ${slug}` : ''}`);
      return null;
    }

    return <ComponentType {...props} />;
  };

  if (!nodeData) return null;
  return selectComponent();
};

export default ComponentFactory;
