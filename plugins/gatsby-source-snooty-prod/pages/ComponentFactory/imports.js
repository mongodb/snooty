import Admonition from '../../../../src/components/Admonition';
import Banner from '../../../../src/components/Banner/Banner';
import BlockQuote from '../../../../src/components/BlockQuote';
import Button from '../../../../src/components/Button';
import Card from '../../../../src/components/Card';
import CardGroup from '../../../../src/components/Card/CardGroup';
import Chapter from '../../../../src/components/Chapters/Chapter';
import Chapters from '../../../../src/components/Chapters';
import Code from '../../../../src/components/Code/Code';
import CodeIO from '../../../../src/components/Code/CodeIO';
import Cond from '../../../../src/components/Cond';
import Container from '../../../../src/components/Container';
import CTA from '../../../../src/components/CTA';
import CTABanner from '../../../../src/components/Banner/CTABanner';
import DefinitionList from '../../../../src/components/DefinitionList';
import DefinitionListItem from '../../../../src/components/DefinitionList/DefinitionListItem';
import DeprecatedVersionSelector from '../../../../src/components/DeprecatedVersionSelector';
import Describe from '../../../../src/components/Describe';
import DriversIndexTiles from '../../../../src/components/DriversIndexTiles';
import Emphasis from '../../../../src/components/Emphasis';
import Extract from '../../../../src/components/Extract';
import Field from '../../../../src/components/FieldList/Field';
import FieldList from '../../../../src/components/FieldList';
import Figure from '../../../../src/components/Figure';
import Footnote from '../../../../src/components/Footnote';
import FootnoteReference from '../../../../src/components/Footnote/FootnoteReference';
import Glossary from '../../../../src/components/Glossary';
import GuideNext from '../../../../src/components/GuideNext';
import Heading from '../../../../src/components/Heading';
import HorizontalList from '../../../../src/components/HorizontalList';
import Image from '../../../../src/components/Image';
import Include from '../../../../src/components/Include';
import Introduction from '../../../../src/components/Introduction';
import Kicker from '../../../../src/components/Kicker';
import LandingIntro from '../../../../src/components/LandingIntro';
import Line from '../../../../src/components/LineBlock/Line';
import LineBlock from '../../../../src/components/LineBlock';
import List from '../../../../src/components/List';
import ListItem from '../../../../src/components/List/ListItem';
import ListTable from '../../../../src/components/ListTable';
import Literal from '../../../../src/components/Literal';
import LiteralBlock from '../../../../src/components/LiteralBlock';
import LiteralInclude from '../../../../src/components/LiteralInclude';
import MongoWebShell from '../../../../src/components/MongoWebShell';
import OpenAPIChangelog from '../../../../src/components/OpenAPIChangelog';
import Paragraph from '../../../../src/components/Paragraph';
import Reference from '../../../../src/components/Reference';
import RefRole from '../../../../src/components/RefRole';
import ReleaseSpecification from '../../../../src/components/ReleaseSpecification';
import Root from '../../../../src/components/Root';
import Rubric from '../../../../src/components/Rubric';
import SearchResults from '../../../../src/components/SearchResults';
import Strong from '../../../../src/components/Strong';
import SubstitutionReference from '../../../../src/components/SubstitutionReference';
import Tabs from '../../../../src/components/Tabs';
import Target from '../../../../src/components/Target';
import Text from '../../../../src/components/Text';
import Time from '../../../../src/components/Time';
import TitleReference from '../../../../src/components/TitleReference';
import Topic from '../../../../src/components/Topic';
import Transition from '../../../../src/components/Transition';
import ChatbotUi from '../../../../src/components/ChatbotUi';

import Explore from '../../../../src/components/Landing/Explore';
import { MoreWays } from '../../../../src/components/Landing/MoreWays';
import Products from '../../../../src/components/Products';
import ProductItem from '../../../../src/components/Products/ProductItem';
import StandaloneHeader from '../../../../src/components/StandaloneHeader';

import VersionModified from '../../../../src/components/VersionModified';

export const componentMap = async (directives = []) => {
  const imports = {
    admonition: Admonition,
    banner: Banner,
    blockquote: BlockQuote,
    button: Button,
    card: Card,
    'card-group': CardGroup,
    chapter: Chapter,
    chapters: Chapters,
    chatbot: ChatbotUi,
    code: Code,
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
    'drivers-index-tiles': DriversIndexTiles, // deprecated.
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
    'landing:explore': Explore,
    'landing:more-ways': MoreWays,
    'landing:client-libraries': StandaloneHeader,
    'landing:introduction': LandingIntro,
    'landing:product': ProductItem,
    'landing:products': Products,
    line: Line,
    line_block: LineBlock,
    list: List,
    listItem: ListItem,
    'list-table': ListTable,
    literal: Literal,
    literal_block: LiteralBlock,
    literalinclude: LiteralInclude,
    'mongo-web-shell': MongoWebShell,
    only: Cond,
    'openapi-changelog': OpenAPIChangelog,
    paragraph: Paragraph,
    ref_role: RefRole,
    reference: Reference,
    release_specification: ReleaseSpecification,
    root: Root,
    rubric: Rubric,
    'search-results': SearchResults,
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

  const filteredComponents = directives
    .filter((key) => key in imports)
    .reduce((prev, curr) => {
      prev[curr] = imports[curr];
      return prev;
    }, {});
  return directives && directives?.length > 0 ? filteredComponents : imports;
};
