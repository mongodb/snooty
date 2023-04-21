import { useLocation } from '@gatsbyjs/reach-router';

jest.mock('@gatsbyjs/reach-router', () => ({
  useLocation: jest.fn(),
}));

export const mockLocation = (search) => useLocation.mockImplementation(() => ({ search }));
