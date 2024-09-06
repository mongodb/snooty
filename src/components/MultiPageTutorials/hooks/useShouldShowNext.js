import { useActiveMpTutorial } from './useActiveMpTutorial';
import { useMptPageOptions } from './useMptPageOptions';

export const useShouldShowNext = () => {
  const activeTutorial = useActiveMpTutorial();
  const options = useMptPageOptions();
  const hasNextTutorial = activeTutorial && !!activeTutorial.next;
  const hasPageOption = !!options?.['show_next_top'];
  return hasPageOption && hasNextTutorial;
};
