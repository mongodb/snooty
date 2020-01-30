import React from 'react';
import { takeScreenshotOfDocument } from './Screenshot';
import useViewport from '../../hooks/useViewport';

const ScreenshotContext = React.createContext(null);

export function useScreenshot() {
  const context = React.useContext(ScreenshotContext);
  if (!context) {
    throw new Error('You must nest useScreenshot() inside of a ScreenshotProvider.');
  }
  return context;
}

export function ScreenshotProvider({ defaultSelector = '#screenshot-context', children }) {
  const [screenshot, setScreenshot] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const viewport = useViewport();

  const takeScreenshot = async () => {
    setLoading(true);
    setScreenshot({
      dataUri: await takeScreenshotOfDocument(),
      viewport,
    });
    setLoading(false);
  };

  const clearScreenshot = () => {
    setScreenshot(null);
  };

  const value = React.useMemo(() => {
    return {
      screenshot,
      loading,
      takeScreenshot,
      clearScreenshot,
    };
  }, [screenshot, loading, takeScreenshot]);

  return <ScreenshotContext.Provider value={value}>{children}</ScreenshotContext.Provider>;
}
