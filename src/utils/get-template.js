import { Blank, Document, DriversIndex, Guide, GuidesIndex, Landing, OpenAPITemplate, NotFound } from '../templates';

const getTemplate = (project, slug, template) => {
  switch (template) {
    case 'blank':
      return Blank;
    case 'landing':
      return project === 'landing' ? Landing : Document;
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
