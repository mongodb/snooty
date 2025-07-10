import { createContext } from "react";
import { TocItem } from "../components/UnifiedSidenav/types";

export const UnifiedTocContext = createContext<{unifiedToc: TocItem[]}>({
  unifiedToc: [],
});

