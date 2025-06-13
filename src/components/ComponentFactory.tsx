import React from 'react';
import { ComponentType, Node, NodeName, NodeType, RoleName } from '../types/ast';

import { isRoleName } from '../types/ast-utils';
import { Page } from '../context/page-context';
import { LAZY_COMPONENTS } from './ComponentFactoryLazy';
import Admonition, { admonitionMap } from './Admonition';
import Banner from './Banner/Banner';
import BlockQuote from './BlockQuote';
import Button from './Button';
import Card from './Card';
import CardGroup from './Card/CardGroup';
import Chapter from './Chapters/Chapter';
import Chapters from './Chapters';
import Code from './Code/Code';
import CodeIO from './Code/CodeIO';
import Collapsible from './Collapsible';
import CommunityPillLink from './CommunityPillLink';
import Cond from './Cond';
import Container from './Container';
import CTA from './CTA';
import CTABanner from './Banner/CTABanner';
import DefinitionList from './DefinitionList';
import DefinitionListItem from './DefinitionList/DefinitionListItem';
import DeprecatedVersionSelector from './DeprecatedVersionSelector';
import Describe from './Describe';
import Emphasis from './Emphasis';
import Extract from './Extract';
import Field from './FieldList/Field';
import FieldList from './FieldList';
import Figure from './Figure';
import Footnote from './Footnote';
import FootnoteReference from './Footnote/FootnoteReference';
import Glossary from './Glossary';
import GuideNext from './GuideNext';
import Heading from './Heading';
import HorizontalList from './HorizontalList';
import Image from './Image';
import Include from './Include';
import Introduction from './Introduction';
import Kicker from './Kicker';
import Line from './LineBlock/Line';
import LineBlock from './LineBlock';
import List from './List';
import ListItem from './List/ListItem';
import ListTable from './ListTable';
import Literal from './Literal';
import LiteralBlock from './LiteralBlock';
import LiteralInclude from './LiteralInclude';
import { MethodSelector } from './MethodSelector';
import OpenAPIChangelog from './OpenAPIChangelog';
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
import { ComposableTutorial } from './ComposableTutorial';

const IGNORED_NAMES = new Set([
  'contents',
  'default-domain',
  'dismissible-skills-card',
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

const roleMap: Record<RoleName, React.ComponentType<any>> = {
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

const getComponent = (() => {
  let componentMap:
    | Record<Exclude<ComponentType, 'toctree' | 'role' | 'tab' | 'selected-content'>, React.ComponentType<any>>
    | undefined = undefined;
  return (key: Exclude<ComponentType, 'toctree' | 'role' | 'tab' | 'selected-content'>) => {
    if (componentMap === undefined) {
      componentMap = {
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
        'composable-tutorial': ComposableTutorial,
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
        superscript: Superscript,
        subscript: Subscript,
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
    }
    return componentMap[key];
  };
})();

function getComponentType(type: NodeType, name?: NodeName): React.ComponentType<any> | undefined {
  const lookup = type === 'directive' ? name : type;
  // @ts-ignore
  let ComponentType: React.ComponentType<any> | undefined = lookup ? getComponent(lookup) : undefined;

  if (name) {
    if (type === 'role' && isRoleName(name)) {
      ComponentType = roleMap[name];
    }

    // Various admonition types are all handled by the Admonition component
    if (DEPRECATED_ADMONITIONS.has(name) || name in admonitionMap) {
      ComponentType = getComponent('admonition');
    }
  }

  if (lookup && LAZY_COMPONENTS[lookup]) {
    return LAZY_COMPONENTS[lookup];
  }

  return ComponentType;
}

export type ComponentFactoryProps = {
  nodeData: Node;
  slug?: string;
  sectionDepth?: string | number;
  page?: Page;
  [key: string]: unknown;
};

const ComponentFactory = (props: ComponentFactoryProps) => {
  const { nodeData, slug } = props;

  const selectComponent = () => {
    let domain: string | undefined = '';
    let name: NodeName | undefined;
    const { type } = nodeData;

    if ('name' in nodeData) name = nodeData.name as NodeName;
    if ('domain' in nodeData) domain = nodeData.domain as string;

    if (IGNORED_TYPES.has(type) || (name && IGNORED_NAMES.has(name))) {
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
