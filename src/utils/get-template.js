import {
  Blank,
  Document,
  DriversIndex,
  Guide,
  GuidesIndex,
  Homepage,
  OpenAPITemplate,
  ProductLanding,
  NotFound,
} from '../templates';

const getTemplate = (project, slug, template) => {
  switch (template) {
    case 'blank':
      return Blank;
    case 'landing':
      switch (project) {
        // The Homepage template and the 'landing' project represent docs.mongodb.com.
        case 'landing':
          return Homepage;
        default:
          return ProductLanding;
      }
    case 'openapi':
      return OpenAPITemplate;
    case 'errorpage':
      return NotFound;
    default:
      const isIndex = slug === '/';
      switch (project) {
        case 'guides':
          return isIndex ? GuidesIndex : Guide;
        case 'drivers':
          return isIndex ? DriversIndex : Document;
        default:
          return Document;
      }
  }
};

export { getTemplate };
