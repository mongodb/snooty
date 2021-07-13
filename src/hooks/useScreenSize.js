import useMedia from './use-media';
import { theme } from '../theme/docsTheme';

export default function useScreenSize() {
  const isMobile = useMedia(theme.screenSize.upToSmall);
  const isTabletOrMobile = useMedia(theme.screenSize.upToLarge);
  const isTablet = useMedia(theme.screenSize.tablet);

  const screen = {
    isMobile,
    isTabletOrMobile,
    isTablet,
  };
  return screen;
}
