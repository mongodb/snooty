import { createContext } from 'react';

export const PageContext = createContext({
  page: null,
  template: null,
  slug: null,
});
