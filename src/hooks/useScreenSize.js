import { useMediaQuery } from 'react-responsive';

export default function useScreenSize() {
  const isSmallScreen = useMediaQuery({ query: '(max-width: 750px)' });
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
  const isMediumScreen = useMediaQuery({ query: 'only screen and (max-width: 767px)' });
  const isMobile = useMediaQuery({ query: 'only screen and (max-width: 374px)' });
  // const isDesktopOrLaptop = useMediaQuery({ query: '(min-device-width: 1224px)' });
  // const isBigScreen = useMediaQuery({ query: '(min-device-width: 1824px)' });
  // const isTabletOrMobileDevice = useMediaQuery({ query: '(max-device-width: 1224px)' });
  // const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });
  // const isRetina = useMediaQuery({ query: '(min-resolution: 2dppx)' });

  const screen = {
    isMediumScreen,
    isMobile,
    isTabletOrMobile,
    isSmallScreen,
  };
  return screen;
}
