module.exports = {
  useSiteMetadata: jest.fn().mockReturnValue({
    branch: 'master',
    project: 'guides',
    title: 'MongoDB Guides',
    user: 'andrew',
  }),
};
