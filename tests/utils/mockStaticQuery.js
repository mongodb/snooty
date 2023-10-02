import * as Gatsby from 'gatsby';

const useStaticQuery = jest.spyOn(Gatsby, 'useStaticQuery');
const mockStaticQuery = (mockSiteMetadata = {}) => {
  useStaticQuery.mockImplementation(() => ({
    site: {
      siteMetadata: mockSiteMetadata,
    },
  }));
};

export default mockStaticQuery;
