import React from 'react';
import PropTypes from 'prop-types';
import { Variant } from '@leafygreen-ui/callout';

import RoleAbbr from '../../../../src/components/Roles/Abbr';
import RoleClass from '../../../../src/components/Roles/Class';
import RoleCommand from '../../../../src/components/Roles/Command';
import RoleFile from '../../../../src/components/Roles/File';
import RoleGUILabel from '../../../../src/components/Roles/GUILabel';
import RoleHighlight from '../../../../src/components/Roles/Highlight';
import RoleIcon from '../../../../src/components/Roles/Icon';
import RoleKbd from '../../../../src/components/Roles/Kbd';
import RoleRed from '../../../../src/components/Roles/Red';
import RoleRequired from '../../../../src/components/Roles/Required';
import Subscript from '../../../../src/components/Subscript';
import Superscript from '../../../../src/components/Superscript';

import Procedure from '../../../../src/components/Procedure';
import Section from '../../../../src/components/Section';
import { LAZY_COMPONENTS } from './lazy-imports';
import { componentMap as filterComponents } from './imports';

export const roleMap = {
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

const admonitionMap = {
  example: Variant.Example,
  important: Variant.Important,
  note: Variant.Note,
  tip: Variant.Tip,
  see: Variant.Tip,
  seealso: Variant.Tip,
  warning: Variant.Warning,
};

const staticComponentsMap = {
  procedure: Procedure,
  section: Section,
};

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

const ComponentFactory = (props) => {
  const { nodeData, slug, components = [] } = props;

  // TODO: Pass list of directives to filter components once available.
  // Potentially passable via props arg.
  const componentMap = { ...filterComponents(components), ...staticComponentsMap };

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
    if (process.env.npm_config_dynamicimports) console.warn(`Found ${componentMap} instead`);

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
