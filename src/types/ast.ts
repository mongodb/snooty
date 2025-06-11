type ComponentType =
  | Exclude<NodeType, 'directive' | 'directive_argument' | 'role' | 'target_identifier'>
  | 'admonition'
  | 'banner'
  | 'blockquote'
  | 'button'
  | 'card'
  | 'card-group'
  | 'chapter'
  | 'chapters'
  | 'collapsible'
  | 'community-driver'
  | 'composable-tutorial'
  | 'cond'
  | 'container'
  | 'cta'
  | 'deprecated'
  | 'deprecated-version-selector'
  | 'describe'
  | 'extract'
  | 'field'
  | 'field_list'
  | 'figure'
  | 'footnote'
  | 'footnote_reference'
  | 'glossary'
  | 'guide-next'
  | 'hlist'
  | 'image'
  | 'include'
  | 'introduction'
  | 'io-code-block'
  | 'kicker'
  | 'literal_block'
  | 'list-table'
  | 'literalinclude'
  | 'openapi-changelog'
  | 'procedure'
  | 'ref_role'
  | 'role'
  | 'release_specification'
  | 'rubric'
  | 'search-results'
  | 'section'
  | 'seealso'
  | 'selected-content'
  | 'sharedinclude'
  | 'substitution_reference'
  | 'tab'
  | 'tabs-selector'
  | 'time'
  | 'title_reference'
  | 'transition'
  | 'versionadded'
  | 'versionchanged'
  | 'tabs'
  | 'wayfinding';

type DirectiveName =
  | AdmonitionName
  | 'admonition'
  | 'banner'
  | 'blockquote'
  | 'collapsible'
  | 'community-driver'
  | 'composable-tutorials'
  | 'container'
  | 'contents'
  | 'deprecated'
  | 'directive'
  | 'dismissible-skills-card'
  | 'facet'
  | 'icon'
  | 'input'
  | 'io-code-block'
  | 'list-table'
  | 'literalinclude'
  | 'meta'
  | 'openapi-changelog'
  | 'output'
  | 'procedure'
  | 'ref_role'
  | 'role'
  | 'release_specification'
  | 'rubric'
  | 'search-results'
  | 'section'
  | 'seealso'
  | 'selected-content'
  | 'sharedinclude'
  | 'substitution_reference'
  | 'tab'
  | 'tabs-selector'
  | 'time'
  | 'title_reference'
  | 'transition'
  | 'toctree'
  | 'versionadded'
  | 'versionchanged'
  | 'tabs'
  | 'wayfinding';

type NodeType =
  | 'code'
  | 'cta-banner'
  | 'definitionList'
  | 'definitionListItem'
  | 'directive'
  | 'directive_argument'
  | 'emphasis'
  | 'heading'
  | 'line'
  | 'line_block'
  | 'list'
  | 'listItem'
  | 'literal'
  | 'method-selector'
  | 'only'
  | 'paragraph'
  | 'reference'
  | 'role'
  | 'root'
  | 'section'
  | 'strong'
  | 'tabs'
  | 'target'
  | 'target_identifier'
  | 'text';

type RoleName = (typeof roleNames)[number];
export const roleNames = [
  'abbr',
  'class',
  'command',
  'file',
  'guilabel',
  'icon',
  'highlight-blue',
  'highlight-green',
  'highlight-red',
  'highlight-yellow',
  'icon-fa5',
  'icon-fa5-brands',
  'icon-fa4',
  'icon-mms',
  'icon-charts',
  'icon-lg',
  'kbd',
  'red',
  'gold',
  'required',
  'sub',
  'subscript',
  'sup',
  'superscript',
  'link-new-tab',
];

type NodeName = RoleName | DirectiveName | AdmonitionName;

type DirectiveOptions = {
  [key: string]: string;
};

interface Node {
  type: NodeType;
}

interface ParentNode extends Node {
  children: Node[];
}

interface Root extends ParentNode {
  options: Record<string, any>;
  fileid: string;
}

type HeadingNodeSelectorIds = {
  tab?: string;
  'method-option'?: string;
  'selected-content'?: Record<string, string>;
  children?: HeadingNodeSelectorIds;
};

interface HeadingNode extends ParentNode {
  type: 'heading';
  depth: number;
  title: string;
  id: string;
  selector_ids: HeadingNodeSelectorIds;
}

interface ParagraphNode extends ParentNode {
  type: 'paragraph';
}

interface EmphasisNode extends ParentNode {
  type: 'emphasis';
}

interface StrongNode extends ParentNode {
  type: 'strong';
}

interface ReferenceNode extends ParentNode {
  type: 'reference';
  refuri: string;
}

interface Directive<TOptions = DirectiveOptions> extends ParentNode {
  type: 'directive';
  name: DirectiveName;
  argument: Node[];
  domain?: string;
  options?: TOptions;
}

interface BlockQuoteNode extends Directive {
  name: 'blockquote';
}

type ButtonOptions = {
  uri: string;
};

interface ButtonNode extends Directive<ButtonOptions> {
  options: ButtonOptions;
}

interface ContainerNode extends Directive {
  name: 'container';
  argument: TextNode[];
}

type DismissibleSkillsCardOptions = {
  skill: string;
  url: string;
};

interface DismissibleSkillsCardNode extends Directive<DismissibleSkillsCardOptions> {
  name: 'dismissible-skills-card';
  options: DismissibleSkillsCardOptions;
}

interface ListTableNode extends Directive {
  name: 'list-table';
  children: ListNode[];
  options?: {
    widths?: string;
    'header-rows'?: string;
  };
}

interface ListNode extends ParentNode {
  type: 'list';
  enumtype: 'unordered' | 'ordered';
  children: ListItemNode[];
}

interface ListItemNode extends ParentNode {
  type: 'listItem';
}

interface LiteralNode extends ParentNode {
  type: 'literal';
}

interface LineBlockNode extends ParentNode {
  type: 'line_block';
}

interface LineNode extends ParentNode {
  type: 'line';
}

interface TextNode extends Node {
  type: 'text';
  value: string;
}

interface DefinitionListNode extends ParentNode {
  type: 'definitionList';
}

interface DefinitionListItemNode extends ParentNode {
  type: 'definitionListItem';
  term: Node[];
}

interface CodeNode extends Node {
  type: 'code';
  lang: string;
  copyable: boolean;
  emphasize_lines: number[];
  value: string;
  linenos: boolean;
  caption?: string;
  source?: string;
  lineno_start?: number;
}

type IOCodeBlockOptions = {
  copyable: boolean;
};

interface IOCodeBlockNode extends Directive<IOCodeBlockOptions> {
  name: 'io-code-block';
  children: [IOInputNode] | [IOInputNode, IOOutputNode];
  options: IOCodeBlockOptions;
}

type InputOutputOptions = {
  language: string;
  linenos: boolean;
  visible?: boolean;
};

interface IOInputNode extends Directive<InputOutputOptions> {
  name: 'input';
  children: CodeNode[];
  options: InputOutputOptions;
}

interface IOOutputNode extends Directive<InputOutputOptions> {
  name: 'output';
  children: CodeNode[];
  options: InputOutputOptions;
}

interface MethodNode extends ParentNode {
  type: 'target';
  name: 'method';
  domain: 'mongodb';
}

interface DirectiveArgumentNode extends ParentNode {
  type: 'directive_argument';
}

interface TargetIdentifierNode extends ParentNode {
  type: 'target_identifier';
  ids: string[];
}

type CollapsibleOptions = {
  heading?: string;
  sub_heading?: string;
  id?: string;
};

interface CollapsibleNode extends Directive<CollapsibleOptions> {
  name: 'collapsible';
  options?: CollapsibleOptions;
}

interface ContentsOptions {
  local?: boolean;
  backlinks?: string;
  depth?: number;
  class?: string;
}

interface ContentsNode extends Directive<ContentsOptions> {
  name: 'contents';
  options: ContentsOptions;
}

interface TabsNode extends Directive {
  type: 'directive';
  name: 'tabs';
}

interface TabOptions {
  tabid: string;
}

interface TabNode extends Directive<TabOptions> {
  type: 'directive';
  name: 'tab';
  options?: TabOptions;
}

interface FacetOptions {
  name: string;
  values: string;
}

interface FacetNode extends Directive<FacetOptions> {
  type: 'directive';
  name: 'facet';
  options?: FacetOptions;
}

type AdmonitionName = 'example' | 'note' | 'tip' | 'see' | 'seealso' | 'warning' | 'important';

interface AdmonitionNode extends Directive {
  type: 'directive';
  name: AdmonitionName;
}

interface TocTreeEntry {
  title: [TextNode];
  slug: string;
  children: TocTreeEntry[];
  options?: TocTreeOptions;
}

interface TocTreeOptions {
  drawer?: boolean;
  project?: string;
  versions?: string[];
  osiris_parent?: boolean;
}

interface TocTreeDirective extends Directive<TocTreeOptions> {
  type: 'directive';
  name: 'toctree';
  entries: Array<TocTreeEntry>;
}

type CommunityDriverPillOptions = {
  url: string;
};

interface CommunityDriverPill extends Directive<CommunityDriverPillOptions> {
  name: 'community-driver';
  options: CommunityDriverPillOptions;
}

interface ComposableTutorialOption {
  default: string;
  dependencies: Record<string, string>[];
  // selections used to display list of dropdowns
  // ie. [{value: 'nodejs', text: 'Node.js'}, {value: 'cpp', text: 'C++'}]
  selections: { value: string; text: string }[];
  text: string;
  value: string;
}

interface ComposableTutorialNode extends Directive {
  type: 'directive';
  name: 'composable-tutorials';
  children: ComposableNode[];
  composable_options: ComposableTutorialOption[];
}

interface ComposableNode extends Directive {
  type: 'directive';
  name: 'selected-content';
  // selections required to show this composable node
  // ie. {interface: 'drivers', language: 'nodejs'}
  selections: Record<string, string>;
  children: Node[];
}

type MetaOptions = {
  description?: string;
  canonical?: string;
  robots?: string;
  keywords?: string;
};

interface MetaNode extends Directive<MetaOptions> {
  type: 'directive';
  name: 'meta';
  options: MetaOptions;
}

interface TitleReferenceNode {
  children: TextNode[];
}

type TwitterOptions = {
  creator?: string;
  image?: string;
  'image-alt'?: string;
  site?: string;
  title?: string;
};

interface TwitterNode extends Directive<TwitterOptions> {
  options: TwitterOptions;
}

type BannerOptions = {
  variant: 'info' | 'warning' | 'danger';
};

interface BannerNode extends Directive<BannerOptions> {
  options: BannerOptions;
}

type CTABannerOptions = {
  url: string;
  icon?: string;
};

interface CTABannerNode extends Directive<CTABannerOptions> {
  options: CTABannerOptions;
}

interface VideoOptions {
  title: string;
  description: string;
  'upload-date': string;
  'thumbnail-url': string;
}

interface VideoNode extends Directive<VideoOptions> {
  argument: Array<ReferenceNode>;
}

interface WayfindingNode extends Directive {
  argument: Array<ReferenceNode>;
}

interface WayfindingOptionOptions {
  title: string;
  language: string;
  id: string;
}

interface WayfindingOptionNode extends Directive<WayfindingOptionOptions> {
  argument: Array<ReferenceNode>;
}

interface ReleaseSpecificationNode extends ParentNode {}

interface RefRoleNode extends ParentNode {
  name: 'ref_role';
  domain: string;
  fileid: string[];
  url: string;
}

export type {
  ParentNode,
  Root,
  HeadingNode,
  HeadingNodeSelectorIds,
  ReferenceNode,
  TextNode,
  BlockQuoteNode,
  ButtonNode,
  CodeNode,
  CommunityDriverPill,
  ComponentType,
  ContainerNode,
  Directive,
  DirectiveOptions,
  IOCodeBlockNode,
  IOInputNode,
  IOOutputNode,
  DismissibleSkillsCardNode,
  ListNode,
  ListTableNode,
  ListItemNode,
  ParagraphNode,
  LiteralNode,
  LineBlockNode,
  LineNode,
  Node,
  NodeName,
  NodeType,
  RoleName,
  DefinitionListNode,
  DefinitionListItemNode,
  MethodNode,
  TargetIdentifierNode,
  DirectiveArgumentNode,
  CollapsibleNode,
  CollapsibleOptions,
  ContentsNode,
  EmphasisNode,
  StrongNode,
  TabsNode,
  TabNode,
  TitleReferenceNode,
  TwitterNode,
  FacetNode,
  AdmonitionNode,
  AdmonitionName,
  TocTreeEntry,
  TocTreeDirective,
  ComposableNode,
  ComposableTutorialNode,
  ComposableTutorialOption,
  MetaNode,
  BannerNode,
  CTABannerNode,
  VideoNode,
  WayfindingNode,
  WayfindingOptionNode,
  ReleaseSpecificationNode,
  RefRoleNode,
};
