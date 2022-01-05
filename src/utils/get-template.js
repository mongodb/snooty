import { Blank, Document, DriversIndex, Landing, OpenAPITemplate, ProductLanding, NotFound } from '../templates';

const getTemplate = (templateName) => {
  let template;
  let sidenav;
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
    case 'landing':
      template = Landing;
      sidenav = true;
      break;
    case 'openapi':
      template = OpenAPITemplate;
      break;
    case 'product-landing':
      template = ProductLanding;
      sidenav = true;
      break;
    // Default template and guide template share very similar layouts
    default:
      template = Document;
      sidenav = true;
      break;
  }

  return { Template: template, sidenav };
};

export { getTemplate };
