// Need to figure out which is node type and which is component type
type ComponentType =
  | Exclude<NodeType, 'block-quote' | 'directive' | 'directive_argument' | 'role' | 'target_identifier'>
  | 'banner'
  | 'blockquote'
  | 'button'
  | 'card'
  | 'card-group'
  | 'chapter'
  | 'chapters'
  | 'code'
  | 'collapsible'
  | 'community-driver'
  | 'io-code-block'
  | 'composable-tutorial'
  | 'cond'
  | 'container'
  | 'cta'
  | 'cta-banner'
  | 'definitionList'
  | 'definitionListItem'
  | 'deprecated'
  | 'deprecated-version-selector'
  | 'describe'
  | 'emphasis'
  | 'extract'
  | 'field'
  | 'field_list'
  | 'figure'
  | 'footnote'
  | 'footnote_reference'
  | 'glossary'
  | 'guide-next'
  | 'heading'
  | 'hlist'
  | 'image'
  | 'include'
  | 'introduction'
  | 'kicker'
  | 'line'
  | 'line_block'
  | 'literal_block';

type NodeType =
  | 'admonition'
  | 'banner'
  | 'block-quote'
  | 'code'
  | 'root'
  | 'section'
  | 'heading'
  | 'reference'
  | 'directive'
  | 'directive_argument'
  | 'line'
  | 'line_block'
  | 'list'
  | 'list-table'
  | 'listItem'
  | 'text'
  | 'literal'
  | 'literalinclude'
  | 'definitionList'
  | 'definitionListItem'
  | 'emphasis'
  | 'method-selector'
  | 'only'
  | 'openapi-changelog'
  | 'paragraph'
  | 'procedure'
  | 'reference'
  | 'ref_role'
  | 'role'
  | 'release_specification'
  | 'rubric'
  | 'search-results'
  | 'section'
  | 'seealso'
  | 'sharedinclude'
  | 'strong'
  | 'substitution_reference'
  | 'tabs-selector'
  | 'time'
  | 'title_reference'
  | 'transition'
  | 'versionadded'
  | 'versionchanged'
  | 'tabs'
  | 'target'
  | 'target_identifier'
  | 'text'
  | 'wayfinding';

type RoleName =
  | 'abbr'
  | 'class'
  | 'command'
  | 'file'
  | 'guilabel'
  | 'icon'
  | 'highlight-blue'
  | 'highlight-green'
  | 'highlight-red'
  | 'highlight-yellow'
  | 'icon-fa5'
  | 'icon-fa5-brands'
  | 'icon-fa4'
  | 'icon-mms'
  | 'icon-charts'
  | 'icon-lg'
  | 'kbd'
  | 'red'
  | 'gold'
  | 'required'
  | 'sub'
  | 'subscript'
  | 'sup'
  | 'superscript'
  | 'link-new-tab';

type NodeName =
  | RoleName
  | AdmonitionName
  | 'blockquote'
  | 'collapsible'
  | 'composable-tutorials'
  | 'contents'
  | 'deprecated'
  | 'input'
  | 'io-code-block'
  | 'facet'
  | 'list-table'
  | 'meta'
  | 'output'
  | 'selected-content'
  | 'tabs'
  | 'tab'
  | 'toctree'
  | 'versionadded'
  | 'versionchanged';

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
  name: NodeName;
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
  type: 'directive';
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
  type: 'directive';
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
  title?: string;
  slug?: string;
}

interface TocTreeOptions {
  osiris_parent: boolean;
}

interface TocTreeDirective extends Directive<TocTreeOptions> {
  type: 'directive';
  name: 'toctree';
  entries: TocTreeEntry[];
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

interface MetaNode extends Directive {
  type: 'directive';
  name: 'meta';
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
  ComponentType,
  Directive,
  DirectiveOptions,
  IOCodeBlockNode,
  IOInputNode,
  IOOutputNode,
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
};
