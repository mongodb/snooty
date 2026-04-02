import { useLocation } from '@gatsbyjs/reach-router';

jest.mock('@gatsbyjs/reach-router', () => ({
  useLocation: jest.fn(),
}));

export const mockLocation = (search, pathname, hash, href) => {
  const url = (pathname || '/') + (search || '') + (hash || '');
  window.history.replaceState({}, '', url);
  useLocation.mockImplementation(() => ({ search, pathname, hash, href }));
};
