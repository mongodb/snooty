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
  | 'list-table'
  | 'contents'
  | 'collapsible'
  | 'tabs'
  | 'tab'
  | 'facet'
  | 'toctree'
  | 'deprecated'
  | 'versionadded'
  | 'versionchanged';

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

interface BlockQuoteNode extends ParentNode {
  type: 'block-quote';
}

interface HeadingNode extends ParentNode {
  type: 'heading';
  id: string;
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

interface Directive<TOptions = { [key: string]: string }> extends ParentNode {
  type: 'directive';
  name: NodeName;
  argument: Node[];
  domain?: string;
  options?: TOptions;
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

interface valueNode extends Node {
  value: string;
}
interface titleReferenceNode {
  children: valueNode[];
}

type TwitterOptions = {
  creator: string;
  image: string;
  'image-alt': string;
  site: string;
  title: string;
};

interface TwitterNode extends Directive<TwitterOptions> {
  options: TwitterOptions;
}
interface VersionModifiedNode extends Directive {
  children: Node[];
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

export type {
  ComponentType,
  NodeType,
  RoleName,
  NodeName,
  Node,
  ParentNode,
  Root,
  HeadingNode,
  ReferenceNode,
  TextNode,
  CodeNode,
  Directive,
  ListNode,
  ListTableNode,
  ListItemNode,
  ParagraphNode,
  LiteralNode,
  LineBlockNode,
  LineNode,
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
  FacetNode,
  AdmonitionNode,
  AdmonitionName,
  TocTreeEntry,
  TocTreeDirective,
  TwitterOptions,
  TwitterNode,
  VersionModifiedNode,
  titleReferenceNode,
  BlockQuoteNode,
};
