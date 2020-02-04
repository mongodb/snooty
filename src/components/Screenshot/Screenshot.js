import { capture, OutputType } from 'html-screen-capture-js';
import rasterizeHTML from 'rasterizehtml';
import { isBrowser } from '../../utils/is-browser';

export default async function takeScreenshot(subject, config = {}) {
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

export async function takeFeedbackScreenshot() {
  const dataUri =
    isBrowser() &&
    (await takeScreenshot(document, {
      classesOfIgnoredDocBodyElements: ['feedback-form'],
    }));
  return dataUri;
}
