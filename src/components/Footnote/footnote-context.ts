import { createContext } from 'react';

export interface FootnoteContextType {
  footnotes: Record<
    string,
    {
      references: string[];
      label: string;
    }
  >;
}

const FootnoteContext = createContext<FootnoteContextType>({
  footnotes: {},
});

export default FootnoteContext;
