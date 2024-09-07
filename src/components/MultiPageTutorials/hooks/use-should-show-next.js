import { useActiveMpTutorial } from './use-active-mp-tutorial';
import { useMptPageOptions } from './use-mpt-page-options';

export const useShouldShowNext = () => {
  const activeTutorial = useActiveMpTutorial();
  const options = useMptPageOptions();
  const hasNextTutorial = activeTutorial && !!activeTutorial.next;
  const hasPageOption = !!options?.['show_next_top'];
  return hasPageOption && hasNextTutorial;
};
