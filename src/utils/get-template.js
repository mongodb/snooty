import { Blank, Document, DriversIndex, Landing, OpenAPITemplate, ProductLanding, NotFound } from '../templates';

const getTemplate = (project, slug, templateName) => {
  let template;
  let sidenav;
  switch (templateName) {
    case 'blank':
      template = Blank;
      break;
    case 'landing':
      template = Landing;
      sidenav = true;
      break;
    case 'product-landing':
      template = ProductLanding;
      sidenav = true;
      break;
    case 'openapi':
      template = OpenAPITemplate;
      break;
    case 'errorpage':
      template = NotFound;
      break;
    default:
      const isIndex = slug === '/';
      switch (project) {
        case 'drivers':
          template = isIndex ? DriversIndex : Document;
          sidenav = true;
          break;
        default:
          template = Document;
          sidenav = true;
      }
      break;
  }

  return { Template: template, sidenav };
};

export { getTemplate };
