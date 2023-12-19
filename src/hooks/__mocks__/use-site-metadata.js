import { jest } from '@jest/globals';

module.exports = {
  useSiteMetadata: jest.fn().mockReturnValue({
    branch: 'master',
    project: 'datalake',
    title: 'MongoDB Datalake',
    user: 'andrew',
  }),
};
