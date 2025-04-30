import { tocData } from '../../toc_data/toc';

export function useUnifiedToc() {
  // TODO: use memo for preprocessing, if doesnt work, try build time solution
  return tocData();
}
