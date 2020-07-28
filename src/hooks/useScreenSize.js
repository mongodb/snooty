import { useMediaQuery } from 'react-responsive';
import useMedia from './use-media';
import { theme } from '../theme/docsTheme';

export default function useScreenSize() {
  const isSmallScreen = useMediaQuery({ query: '(max-width: 750px)' });
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
  const isMobile = useMedia(theme.screenSize.upToSmall);
  // const isDesktopOrLaptop = useMediaQuery({ query: '(min-device-width: 1224px)' });
  // const isBigScreen = useMediaQuery({ query: '(min-device-width: 1824px)' });
  // const isTabletOrMobileDevice = useMediaQuery({ query: '(max-device-width: 1224px)' });
  // const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });
  // const isRetina = useMediaQuery({ query: '(min-resolution: 2dppx)' });

  const screen = {
    isMobile,
    isTabletOrMobile,
    isSmallScreen,
  };
  return screen;
}
