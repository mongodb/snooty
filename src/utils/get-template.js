import { Blank, Document, DriversIndex, Guide, GuidesIndex, Landing, OpenAPITemplate } from '../templates';

const getTemplate = (project, slug, template) => {
  switch (template) {
    case 'blank':
      return Blank;
    case 'landing':
      return Landing;
    case 'openapi':
      return OpenAPITemplate;
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
