import {
  Blank,
  Document,
  DriversIndex,
  Guide,
  GuidesIndex,
  Landing,
  OpenAPITemplate,
  ProductLanding,
  NotFound,
} from '../templates';

const getTemplate = (project, slug, templateName) => {
  let template;
  let sidebar;
  switch (templateName) {
    case 'blank':
      template = Blank;
      break;
    case 'landing':
      template = Landing;
      sidebar = true;
      break;
    case 'product-landing':
      template = ProductLanding;
      sidebar = true;
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
        case 'guides':
          template = isIndex ? GuidesIndex : Guide;
          break;
        case 'drivers':
          template = isIndex ? DriversIndex : Document;
          sidebar = true;
          break;
        default:
          template = Document;
          sidebar = true;
      }
      break;
  }

  return { Template: template, sidebar };
};

export { getTemplate };
