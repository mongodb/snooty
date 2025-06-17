import { createContext } from 'react';

interface Footnote {
  references: string[];
  label: string;
}

interface FootnoteContextType {
  footnotes: Record<string, Footnote>;
}

const FootnoteContext = createContext<FootnoteContextType>({
  footnotes: {},
});

export default FootnoteContext;
