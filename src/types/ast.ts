import { HIGHLIGHT_BLUE, HIGHLIGHT_GREEN, HIGHLIGHT_RED, HIGHLIGHT_YELLOW } from '../components/Roles/Highlight';
import { ActiveTabs, Selectors } from '../components/Tabs/tab-context';
import { PageTemplateType } from '../context/page-context';

type ComponentType =
  | Exclude<NodeType, 'directive' | 'directive_argument' | 'role' | 'target_identifier' | 'inline_target'>
  | 'admonition'
  | 'banner'
  | 'blockquote'
  | 'button'
  | 'card'
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
  | 'card'
  | 'card-group'
  | 'chapter'
  | 'chapters'
  | 'collapsible'
  | 'community-driver'
  | 'composable-tutorials'
  | 'container'
  | 'contents'
  | 'deprecated'
  | 'directive'
  | 'dismissible-skills-card'
  | 'entry'
  | 'facet'
  | 'hlist'
  | 'figure'
  | 'ia'
  | 'icon'
  | 'image'
  | 'include'
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
  | 'step'
  | 'substitution_reference'
  | 'tab'
  | 'tabs-selector'
  | 'time'
  | 'transition'
  | 'toctree'
  | 'versionadded'
  | 'versionchanged'
  | 'tabs'
  | 'wayfinding'
  | 'wayfinding-option'
  | 'wayfinding-description';

type NodeType =
  | 'card-group'
  | 'code'
  | 'cta-banner'
  | 'definitionList'
  | 'definitionListItem'
  | 'directive'
  | 'directive_argument'
  | 'emphasis'
  | 'field'
  | 'field_list'
  | 'footnote'
  | 'footnote_reference'
  | 'heading'
  | 'inline_target'
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
  | 'superscript'
  | 'subscript'
  | 'tabs'
  | 'target'
  | 'target_identifier'
  | 'text'
  | 'title_reference';

type RoleName = (typeof roleNames)[number];
export const roleNames = [
  'abbr',
  'class',
  'command',
  'file',
  'guilabel',
  'icon',
  HIGHLIGHT_BLUE,
  HIGHLIGHT_GREEN,
  HIGHLIGHT_RED,
  HIGHLIGHT_YELLOW,
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

interface TextParentNode extends Node {
  children: TextNode[];
}

interface ParentNode extends Node {
  children: ASTNode[];
}

type PageOptionsKey = keyof PageOptions;

type PageOptions = {
  template: PageTemplateType;
  default_tabs?: ActiveTabs;
  dismissible_skills_card?: DismissibleSkillsCardOptions;
  has_composable_tutorial?: boolean;
  hidefeedback?: string;
  instruqt?: boolean;
  has_method_selector?: boolean;
  multi_page_tutorial_settings?: {
    show_next_top?: boolean;
  };
  noprevnext?: string;
  'pl-max-width-paragraphs'?: string;
  selectors?: Selectors;
  'tabs-selector-position'?: string;
  time_required?: number;
  [key: string]: any;
};

interface Root extends ParentNode {
  type: 'root';
  options: PageOptions;
  fileid: string;
}

interface ChaptersNode extends Directive {
  name: 'chapters';
}

type ChapterOptions = {
  description: string;
  image: string;
};

interface ChapterNode extends Directive<ChapterOptions> {
  name: 'chapter';
}

interface FootnoteReferenceNode extends ParentNode {
  type: 'footnote_reference';
  id: string;
  refname?: string;
}

interface FootnoteNode extends ParentNode {
  type: `footnote`;
  id: string;
  name?: string;
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
  children: [TextNode];
}

interface ParagraphNode extends ParentNode {
  type: 'paragraph';
}

interface EmphasisNode extends ParentNode {
  type: 'emphasis';
}

interface StrongNode extends TextParentNode {
  type: 'strong';
}

interface SuperscriptNode extends ParentNode {
  type: 'superscript';
}

interface SubscriptNode extends ParentNode {
  type: 'subscript';
}

interface ReferenceNode extends ParentNode {
  type: 'reference';
  refuri: string;
}

interface Directive<TOptions = DirectiveOptions> extends ParentNode {
  type: 'directive';
  name: DirectiveName;
  argument: ASTNode[];
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

type ListTableOptions = {
  align?: string;
  width?: string;
  widths?: string;
  'header-rows'?: string;
  'stub-columns'?: string;
};

interface ListTableNode extends Directive<ListTableOptions> {
  name: 'list-table';
  children: ParentListNode[];
  options?: ListTableOptions;
}

interface BaseFieldNode extends ParentNode {
  name: string;
  label?: string;
}

interface FieldNode extends BaseFieldNode {
  type: 'field';
}

interface FieldListNode extends BaseFieldNode {
  type: 'field_list';
}

interface ParentListNode extends ParentNode {
  type: 'list';
  enumtype: 'unordered' | 'ordered';
  startat?: number;
  children: ParentListItemNode[];
}

interface ListNode extends ParentNode {
  type: 'list';
  enumtype: 'unordered' | 'ordered';
  startat?: number;
  children: ListItemNode[];
}

interface ParentListItemNode extends ParentNode {
  type: 'listItem';
  children: ListNode[];
}

interface ListItemNode extends ParentNode {
  type: 'listItem';
  children: ParentNode[];
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

type CardGroupOptions = {
  columns: number;
  layout?: string;
  style?: string;
  type?: string;
};

interface CardGroupNode extends Directive<CardGroupOptions> {
  name: 'card-group';
  options: CardGroupOptions;
}

type CardOptions = {
  cta?: string;
  headline?: string;
  icon?: string;
  'icon-dark'?: string;
  'icon-alt'?: string;
  tag?: string;
  url: string;
};
interface CardNode extends Directive<CardOptions> {
  name: 'card';
  options: CardOptions;
}

interface DefinitionListNode extends ParentNode {
  type: 'definitionList';
  children: DefinitionListItemNode[];
}

interface DefinitionListItemNode extends ParentNode {
  type: 'definitionListItem';
  term: ASTNode[];
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

interface BaseTargetNode extends ParentNode {
  domain: string;
  name: string;
  html_id?: string;
  options?: {};
}

interface TargetNode extends BaseTargetNode {
  type: 'target';
}

interface InlineTargetNode extends BaseTargetNode {
  type: 'inline_target';
}

interface TargetIdentifierNode extends ParentNode {
  type: 'target_identifier';
  ids: string[];
}

interface AbbrRoleNode extends ParentNode {
  type: 'role';
  name: 'abbr';
  children: [TextNode];
}

type CollapsibleOptions = {
  heading?: string;
  sub_heading?: string;
  id?: string;
  expanded?: boolean;
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
  children: TabNode[];
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

type ImageNodeOptions = {
  alt: string;
  lightbox?: boolean;
  align?: string;
  checksum?: string;
  height?: string;
  scale?: string;
  width?: string;
  figwidth?: string;
};

interface FigureNode extends Directive<ImageNodeOptions> {
  name: 'figure';
  argument: [TextNode];
  options: ImageNodeOptions;
}

interface ImageNode extends Directive<ImageNodeOptions> {
  name: 'image';
  argument: [TextNode];
  options: ImageNodeOptions;
}

type AdmonitionName = 'example' | 'note' | 'tip' | 'see' | 'seealso' | 'warning' | 'important';

interface AdmonitionNode extends Directive {
  type: 'directive';
  name: AdmonitionName;
}

type TocTreeOptions = {
  drawer?: boolean;
  project?: string;
  versions?: string[];
  osiris_parent?: boolean;
  tocicon?: string;
  version?: string;
  urls?: Record<string, string>;
};
interface TocTreeEntry extends ParentNode {
  title: [TextNode];
  slug: string;
  children: TocTreeEntry[];
  options?: TocTreeOptions;
  url?: string;
}

interface TocTreeDirective extends Directive<TocTreeOptions> {
  type: 'directive';
  name: 'toctree';
  entries: Array<TocTreeEntry>;
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

interface ClassRoleNode extends ParentNode {
  type: 'role';
  name: 'class';
  target: string;
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
  children: ASTNode[];
}

const highlightRoleNames = [HIGHLIGHT_BLUE, HIGHLIGHT_GREEN, HIGHLIGHT_RED, HIGHLIGHT_YELLOW];
type HighlightRoleNames = (typeof highlightRoleNames)[number];

interface HighlightNode extends ParentNode {
  type: 'role';
  name: HighlightRoleNames;
}

interface IANode extends Directive {
  name: 'ia';
}

type IAEntryNodeOptions = {
  url: string;
};

interface IAEntryNode extends Directive {
  name: 'entry';
  options: IAEntryNodeOptions;
}

interface LinkNewTabNode extends ParentNode {
  type: 'role';
  name: 'link-new-tab';
  target: string;
}

const roleIconNames = [
  'icon',
  'icon-fa5-brands',
  'iconb',
  'icon-mms',
  'icon-mms-org',
  'icon-charts',
  'icon-fa4',
  'icon-lg',
];
type RoleIconNames = (typeof roleIconNames)[number];

interface RoleIconNode extends ParentNode {
  type: 'role';
  name: RoleIconNames;
  target: string;
}

interface RoleManualNode extends ParentNode {
  type: 'role';
  name: 'manual';
  target: string;
}

type MetaOptions = {
  canonical: string;
  description?: string;
  robots?: string;
  keywords?: string;
};

interface MetaNode extends Directive<MetaOptions> {
  type: 'directive';
  name: 'meta';
  options: MetaOptions;
}

type ProcedureStyle = 'connected' | 'normal';

type ProcedureOptions = {
  style?: ProcedureStyle;
  title?: string;
};

interface ProcedureNode extends Directive<ProcedureOptions> {
  name: 'procedure';
  options: ProcedureOptions;
}

interface StepNode extends Directive {
  name: 'step';
}

interface TitleReferenceNode extends ParentNode {
  type: 'title_reference';
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

type HorizontalListNodeOptions = {
  columns: number;
};

interface HorizontalListNode extends Directive<HorizontalListNodeOptions> {
  name: 'hlist';
  options: HorizontalListNodeOptions;
}

type VideoOptions = {
  title: string;
  description: string;
  'upload-date': string;
  'thumbnail-url': string;
};

interface VideoNode extends Directive<VideoOptions> {
  argument: ReferenceNode[];
}

interface WayfindingDescriptionNode extends Directive {
  name: 'wayfinding-description';
}

interface WayfindingNode extends Directive {
  argument: ReferenceNode[];
}

type WayfindingOptionOptions = {
  title: string;
  language: string;
  id: string;
};

interface WayfindingOptionNode extends Directive<WayfindingOptionOptions> {
  argument: ReferenceNode[];
}

type StandaloneHeaderOptions = {
  columns: number;
  cta: string;
  url: string;
};

interface StandaloneHeaderNode extends Directive<StandaloneHeaderOptions> {
  options: StandaloneHeaderOptions;
}

interface SubstitutionReferenceNode extends ParentNode {
  name: 'substitution_reference';
}

interface TargetNode extends ParentNode {
  name: 'target';
  html_id: string;
  options: {
    hidden: boolean;
  };
}

interface ReleaseSpecificationNode extends ParentNode {}

interface RefRoleNode extends ParentNode {
  name: 'ref_role';
  domain: string;
  fileid: string[];
  url: string;
}

type InstruqtOptions = {
  title: string;
  drawer: boolean;
};

interface InstruqtNode extends Directive<InstruqtOptions> {
  argument: TextNode[];
}

interface GuideNextNode extends Directive {}

type ASTNode =
  | AbbrRoleNode
  | AdmonitionNode
  | BannerNode
  | BlockQuoteNode
  | ButtonNode
  | CardGroupNode
  | CardNode
  | ChapterNode
  | ChaptersNode
  | ClassRoleNode
  | CodeNode
  | CollapsibleNode
  | CommunityDriverPill
  | ContentsNode
  | ComposableNode
  | ComposableTutorialNode
  | ContainerNode
  | CTABannerNode
  | DefinitionListNode
  | DefinitionListItemNode
  | Directive
  | DirectiveArgumentNode
  | DismissibleSkillsCardNode
  | EmphasisNode
  | FacetNode
  | FieldNode
  | FieldListNode
  | FigureNode
  | FootnoteNode
  | FootnoteReferenceNode
  | GuideNextNode
  | HeadingNode
  | HighlightNode
  | ImageNode
  | InlineTargetNode
  | InstruqtNode
  | IOCodeBlockNode
  | IOInputNode
  | IOOutputNode
  | LinkNewTabNode
  | ListNode
  | ListTableNode
  | ListItemNode
  | LiteralNode
  | LineBlockNode
  | LineNode
  | MetaNode
  | MethodNode
  | ParagraphNode
  | ParentNode
  | ProcedureNode
  | ReferenceNode
  | StandaloneHeaderNode
  | SuperscriptNode
  | SubscriptNode
  | RefRoleNode
  | ReleaseSpecificationNode
  | RoleIconNode
  | RoleManualNode
  | Root
  | StepNode
  | StrongNode
  | SubstitutionReferenceNode
  | TabNode
  | TabsNode
  | TargetIdentifierNode
  | TargetNode
  | TextNode
  | TitleReferenceNode
  | TwitterNode
  | TocTreeEntry
  | TocTreeDirective
  | VideoNode
  | WayfindingDescriptionNode
  | WayfindingNode
  | WayfindingOptionNode;

export type {
  AbbrRoleNode,
  AdmonitionNode,
  AdmonitionName,
  ASTNode,
  BannerNode,
  BlockQuoteNode,
  ButtonNode,
  CardGroupNode,
  CardNode,
  ChapterNode,
  ChaptersNode,
  ClassRoleNode,
  CodeNode,
  CollapsibleNode,
  CollapsibleOptions,
  CommunityDriverPill,
  ContentsNode,
  ComponentType,
  ComposableNode,
  ComposableTutorialNode,
  ComposableTutorialOption,
  ContainerNode,
  CTABannerNode,
  DefinitionListNode,
  DefinitionListItemNode,
  Directive,
  DirectiveArgumentNode,
  DirectiveOptions,
  DismissibleSkillsCardNode,
  EmphasisNode,
  FacetNode,
  FieldNode,
  FieldListNode,
  FigureNode,
  FootnoteNode,
  FootnoteReferenceNode,
  GuideNextNode,
  HeadingNode,
  HeadingNodeSelectorIds,
  HighlightNode,
  HighlightRoleNames,
  HorizontalListNode,
  IAEntryNode,
  IANode,
  ImageNode,
  InlineTargetNode,
  InstruqtNode,
  IOCodeBlockNode,
  IOInputNode,
  IOOutputNode,
  LinkNewTabNode,
  ListNode,
  ListTableNode,
  ListItemNode,
  LiteralNode,
  LineBlockNode,
  LineNode,
  MetaNode,
  MethodNode,
  Node,
  NodeName,
  NodeType,
  PageOptions,
  PageOptionsKey,
  ParagraphNode,
  ParentListItemNode,
  ParentListNode,
  ParentNode,
  ProcedureNode,
  ProcedureStyle,
  ReferenceNode,
  StandaloneHeaderNode,
  SuperscriptNode,
  SubscriptNode,
  RefRoleNode,
  ReleaseSpecificationNode,
  RoleIconNode,
  RoleManualNode,
  RoleName,
  Root,
  StepNode,
  StrongNode,
  SubstitutionReferenceNode,
  TabNode,
  TabsNode,
  TargetIdentifierNode,
  TargetNode,
  TextNode,
  TitleReferenceNode,
  TwitterNode,
  TocTreeEntry,
  TocTreeDirective,
  VideoNode,
  WayfindingDescriptionNode,
  WayfindingNode,
  WayfindingOptionNode,
};
