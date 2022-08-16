import { useState, useRef, useEffect } from 'react';
import useViewport from '../../../../hooks/useViewport';
import { isBrowser } from '../../../../utils/is-browser';
import { useFeedbackState } from '../context';

// Client-side Only modules
import { capture, OutputType } from 'html-screen-capture-js';
import rasterizeHTML from 'rasterizehtml';

async function takeScreenshot(subject, config = {}) {
  // Convert the page into a "clean" html document that inlines all styles, images, etc.
  const htmlDocument = capture(OutputType.OBJECT, subject, config);
  // Convert the "clean" document into a rasterized <img />. It has the same dimensions as the user's window.
  const { image } = await rasterizeHTML.drawHTML(htmlDocument.innerHTML);
  // Create a <canvas /> and draw the image on it. Set the canvas dimensions to match the image.
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.canvas.width = image.width;
  ctx.canvas.height = image.height;
  ctx.drawImage(image, 0, 0, image.width, image.height);
  // Encode the image to a Base64 PNG Data URI
  const dataUri = canvas.toDataURL('image/png');
  return dataUri;
}

async function takeFeedbackScreenshot() {
  const dataUri =
    isBrowser &&
    (await takeScreenshot(document, {
      classesOfIgnoredDocBodyElements: [
        'feedback-form', // Don't include the feedback form
        'feedback-tooltip', // Don't include any button/star tooltips
        'navbar-brand', // Don't include the MongoDB logo (temporary for CORS)
        'overlayInstructions', // Don't include instruction overlay
        'xButton', // Don't include the X button
      ],
    }));
  return dataUri;
}

export default function useScreenshot() {
  const { submitScreenshot } = useFeedbackState();
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const viewport = useViewport();

  const takeScreenshot = async () => {
    if (!screenshot && !loading && isBrowser) {
      setLoading(true);
      const dataUri = await takeFeedbackScreenshot();
      setScreenshot({
        dataUri,
        viewport,
      });

      // TODO: remove this after testing, this downloads the image for to preview screenshot
      const link = document.createElement('a');
      link.download = 'test.png';
      link.href = dataUri;
      link.click();

      setLoading(false);
    }
  };

  // Only save the screenshot one time
  const savedScreenshot = useRef(null);
  useEffect(() => {
    const isAlreadySaved = screenshot && savedScreenshot.current === screenshot;
    if (screenshot && !isAlreadySaved) {
      savedScreenshot.current = screenshot;
      submitScreenshot(screenshot);
    }
  }, [screenshot, submitScreenshot]);
  return { screenshot, loading, takeScreenshot };
}
