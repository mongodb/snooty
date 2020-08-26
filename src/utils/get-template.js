import { Blank, Document, DriversIndex, Guide, GuidesIndex, Landing } from '../templates';

const getTemplate = (key, slug) => {
  switch (key) {
    case 'blank':
      return Blank;
    case 'landing':
      return Landing;
    default:
      const site = process.env.GATSBY_SITE;
      const isIndex = slug === '/';
      switch (site) {
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
