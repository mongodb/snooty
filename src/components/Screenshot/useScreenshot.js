import React from 'react';
import useViewport from '../../hooks/useViewport';
import { takeFeedbackScreenshot } from './Screenshot';

export function useScreenshot() {
  const [screenshot, setScreenshot] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const viewport = useViewport();

  const takeScreenshot = () => {
    setLoading(true);
  };

  const handleScreenshot = React.useCallback(async () => {
    setScreenshot({
      dataUri: await takeFeedbackScreenshot(),
      viewport,
    });
    setLoading(false);
  }, [viewport]);

  React.useEffect(() => {
    if (loading) {
      handleScreenshot();
    }
  }, [loading, handleScreenshot]);

  const clearScreenshot = () => {
    setScreenshot(null);
  };

  return {
    screenshot,
    loading,
    takeScreenshot,
    clearScreenshot,
  };
}
