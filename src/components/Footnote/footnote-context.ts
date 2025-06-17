import { createContext } from 'react';

export interface Footnote {
  references: string[];
  label: number;
}

interface FootnoteContextType {
  footnotes: Record<string, Footnote>;
}

const FootnoteContext = createContext<FootnoteContextType>({
  footnotes: {},
});

export default FootnoteContext;
