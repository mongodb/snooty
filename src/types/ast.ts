type NodeType =
  | 'root'
  | 'section'
  | 'heading'
  | 'reference'
  | 'directive'
  | 'list'
  | 'list-table'
  | 'listItem'
  | 'text'
  | 'literal'
  | 'definitionList'
  | 'definitionListItem'
  | 'target'
  | 'target_identifier'
  | 'directive_argument'
  | 'code';

interface Node {
  type: NodeType | string;
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

interface Directive<TOptions = { [key: string]: string }> extends ParentNode {
  type: 'directive';
  name: string;
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

export type {
  NodeType,
  Node,
  ParentNode,
  Root,
  HeadingNode,
  HeadingNodeSelectorIds,
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
  ComposableNode,
  ComposableTutorialNode,
  ComposableTutorialOption,
};
