import { OPTION_KEY_SHOW_NEXT_TOP } from '../constants';
import { useActiveMpTutorial } from './use-active-mp-tutorial';
import { useMptPageOptions } from './use-mpt-page-options';

export const useShouldShowNext = () => {
  const activeTutorial = useActiveMpTutorial();
  const options = useMptPageOptions();
  const hasNextTutorial = activeTutorial && !!activeTutorial.next;
  const hasPageOption = !!options?.[OPTION_KEY_SHOW_NEXT_TOP as keyof typeof options];
  return hasPageOption && hasNextTutorial;
};
