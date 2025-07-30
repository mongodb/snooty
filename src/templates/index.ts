import Blank from './blank';
import Document from './document';
import DriversIndex from './drivers-index';
import Instruqt from './instruqt';
import Landing from './landing';
import NotFound from './NotFound';
import FeatureNotAvailable from './FeatureNotAvailable';
import OpenAPITemplate from './openapi';
import ProductLanding from './product-landing';
import Changelog from './changelog';

export type BaseTemplateProps = {
  useChatbot: boolean;
  offlineBanner: JSX.Element;
};

export {
  Blank,
  Document,
  DriversIndex,
  Instruqt,
  Landing,
  NotFound,
  FeatureNotAvailable,
  OpenAPITemplate,
  ProductLanding,
  Changelog,
};
