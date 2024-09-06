import { useActiveMPTutorial } from '../../../hooks/use-active-mp-tutorial';
import { useMptPageOptions } from './useMptPageOptions';

export const useShouldShowNext = () => {
  const activeTutorial = useActiveMPTutorial();
  const options = useMptPageOptions();
  const hasNextTutorial = activeTutorial && !!activeTutorial.next;
  const hasPageOption = !!options?.['show_next_top'];
  return hasPageOption && hasNextTutorial;
};
