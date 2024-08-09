import {
  Blank,
  Document,
  DriversIndex,
  Instruqt,
  Landing,
  OpenAPITemplate,
  ProductLanding,
  NotFound,
  Changelog,
  FeatureNotAvailable,
} from '../templates';

const getTemplate = (templateName) => {
  let template;
  let sidenav;
  let useChatbot = false;
  switch (templateName) {
    case 'blank':
      template = Blank;
      break;
    case 'drivers-index':
      template = DriversIndex;
      sidenav = true;
      break;
    case 'errorpage':
      template = NotFound;
      break;
    case 'feature-not-avail':
      template = FeatureNotAvailable;
      break;
    case 'instruqt':
      template = Instruqt;
      sidenav = true;
      break;
    case 'landing':
      template = Landing;
      sidenav = true;
      useChatbot = true;
      break;
    case 'openapi':
      template = OpenAPITemplate;
      break;
    case 'changelog':
      template = Changelog;
      sidenav = true;
      break;
    case 'product-landing':
      template = ProductLanding;
      sidenav = true;
      break;
    case 'search':
      template = Landing;
      sidenav = true;
      break;
    // Default template and guide template share very similar layouts
    default:
      template = Document;
      sidenav = true;
      break;
  }

  return { Template: template, sidenav, useChatbot };
};

export { getTemplate };
