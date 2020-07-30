import { createContext } from 'react';

// Simple context to pass search results to children
const SearchContext = createContext({ searchTerm: '', shouldAutofocus: false });

export default SearchContext;
