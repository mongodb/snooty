import { useLocation } from '@gatsbyjs/reach-router';

jest.mock('@gatsbyjs/reach-router', () => ({
  useLocation: jest.fn(),
}));

export const mockLocation = (search, pathname, hash, href) =>
  useLocation.mockImplementation(() => ({ search, pathname, hash, href }));
