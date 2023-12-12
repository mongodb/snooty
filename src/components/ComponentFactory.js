import React from 'react';
import PropTypes from 'prop-types';

import { LAZY_COMPONENTS } from './ComponentFactoryLazy';
import Admonition, { admonitionMap } from './Admonition';
import Banner from './Banner/Banner';
import BlockQuote from './BlockQuote';
import Button from './Button';
import Container from './Container';
import CTA from './CTA';
import CTABanner from './Banner/CTABanner';
import DeprecatedVersionSelector from './DeprecatedVersionSelector';
import DriversIndexTiles from './DriversIndexTiles';
import Heading from './Heading';
import Include from './Include';
import Introduction from './Introduction';
import LandingIntro from './LandingIntro';
import Paragraph from './Paragraph';
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
import Target from './Target';
import Text from './Text';
import Time from './Time';
import TitleReference from './TitleReference';
import Topic from './Topic';
import Transition from './Transition';
import ChatbotUi from './ChatbotUi';

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
import Products from './Products';
import ProductItem from './Products/ProductItem';

const IGNORED_NAMES = new Set([
  'contents',
  'default-domain',
  'entry',
  'ia',
  'raw',
  'short-description',
  'tabs-pillstrip',
  'tabs-selector',
  'toctree',
  'meta',
  'facet',
]);
const IGNORED_TYPES = new Set(['comment', 'inline_target', 'named_reference', 'substitution_definition']);
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
  'icon-lg': RoleIcon,
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
  chatbot: ChatbotUi,
  container: Container,
  cta: CTA,
  'cta-banner': CTABanner,
  deprecated: VersionModified,
  'deprecated-version-selector': DeprecatedVersionSelector,
  'drivers-index-tiles': DriversIndexTiles, // deprecated.
  heading: Heading,
  include: Include,
  introduction: Introduction,
  'landing:introduction': LandingIntro,
  'landing:product': ProductItem,
  'landing:products': Products,
  paragraph: Paragraph,
  ref_role: RefRole,
  reference: Reference,
  release_specification: ReleaseSpecification,
  root: Root,
  rubric: Rubric,
  'search-results': SearchResults,
  section: Section,
  sharedinclude: Include,
  strong: Strong,
  substitution_reference: SubstitutionReference,
  tabs: Tabs,
  target: Target,
  text: Text,
  time: Time,
  title_reference: TitleReference,
  topic: Topic,
  transition: Transition,

  versionadded: VersionModified,
  versionchanged: VersionModified,
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

    const ComponentType = getComponentType(type, name, props);

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
