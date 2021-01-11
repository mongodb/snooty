import useMedia from './use-media';
import { theme } from '../theme/docsTheme';

export default function useScreenSize() {
  const isMobile = useMedia(theme.screenSize.upToSmall);
  const isTabletOrMobile = useMedia(theme.screenSize.upToLarge);

  const screen = {
    isMobile,
    isTabletOrMobile,
  };
  return screen;
}
