import React from 'react';

const ComponentMap = {
  card: React.lazy(() => import('./Card')),
  'card-group': React.lazy(() => import('./Card/CardGroup')),
  chapter: React.lazy(() => import('./Chapters/Chapter')),
  chapters: React.lazy(() => import('./Chapters')),
  code: React.lazy(() => import(`./Code/Code`)),
  'io-code-block': React.lazy(() => import('./Code/CodeIO')),
  cond: React.lazy(() => import('./Cond')),
  definitionList: React.lazy(() => import('./DefinitionList')),
  definitionListItem: React.lazy(() => import('./DefinitionList/DefinitionListItem')),
  describe: React.lazy(() => import('./Describe')),
  emphasis: React.lazy(() => import('./Emphasis')),
  extract: React.lazy(() => import('./Extract')),
  field: React.lazy(() => import('./FieldList/Field')),
  field_list: React.lazy(() => import('./FieldList')),
  figure: React.lazy(() => import('./Figure')),
  footnote: React.lazy(() => import('./Footnote')),
  footnote_reference: React.lazy(() => import('./Footnote/FootnoteReference')),
  glossary: React.lazy(() => import('./Glossary')),
  'guide-next': React.lazy(() => import('./GuideNext')),
  hlist: React.lazy(() => import('./HorizontalList')),
  image: React.lazy(() => import(`./Image`)),
  instruqt: React.lazy(() => import('./Instruqt')),
  kicker: React.lazy(() => import('./Kicker')),
  // landing page below the fold
  'landing:explore': React.lazy(() => import('./Landing/Explore')),
  'landing:more-ways': React.lazy(() => import('./Landing/MoreWays')),
  'landing:client-libraries': React.lazy(() => import('./StandaloneHeader')),
  line: React.lazy(() => import('./LineBlock/Line')),
  line_block: React.lazy(() => import('./LineBlock')),
  list: React.lazy(() => import(`./List`)),
  listItem: React.lazy(() => import('./List/ListItem')),
  'list-table': React.lazy(() => import('./ListTable')),
  literal: React.lazy(() => import('./Literal')),
  literal_block: React.lazy(() => import('./LiteralBlock')),
  literalinclude: React.lazy(() => import('./LiteralInclude')),
  'mongo-web-shell': React.lazy(() => import('./MongoWebShell')),
  only: React.lazy(() => import('./Cond')),
  openapi: React.lazy(() => import('./OpenAPI')),
  'openapi-changelog': React.lazy(() => import('./OpenAPIChangelog')),
  procedure: React.lazy(() => import('./Procedure')),
  quiz: React.lazy(() => import('./Widgets/QuizWidget/QuizWidget')),
  quizchoice: React.lazy(() => import('./Widgets/QuizWidget/QuizChoice')),
  video: React.lazy(() => import('./Video')),
};

export const LAZY_COMPONENTS = Object.keys(ComponentMap).reduce((res, key) => {
  const LazyComponent = ComponentMap[key];
  res[key] = (props) => (
    <React.Suspense fallback="Loading...">
      <LazyComponent {...props} />
    </React.Suspense>
  );
  return res;
}, {});
