import * as Gatsby from 'gatsby';

const useStaticQuery = jest.spyOn(Gatsby, 'useStaticQuery');
const mockStaticQuery = (mockSiteMetadata = {}, mockSnootyMetadata = {}) => {
  useStaticQuery.mockImplementation(() => ({
    site: {
      siteMetadata: mockSiteMetadata,
    },
    allSnootyMetadata: {
      nodes: [{ metadata: mockSnootyMetadata }],
    },
  }));
};

export default mockStaticQuery;
