import { createContext } from 'react';

type FootnoteContextType = {
  footnotes: Record<string, unknown>;
};

const FootnoteContext = createContext<FootnoteContextType>({
  footnotes: {},
});

export default FootnoteContext;
