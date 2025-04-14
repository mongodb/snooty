// Client-side Only modules
import { capture, OutputType } from 'html-screen-capture-js';
import rasterizeHTML from 'rasterizehtml';
import { isBrowser } from '../../../utils/is-browser';
import { fabChatbot } from '../ChatbotWidget/ChatbotFab';
import { widgetsContainer } from '..';
import { fwTooltipId } from './components/LeafygreenTooltip';
import { fwInstructionsId, fwExitButtonId } from './components/ScreenshotButton';
import { fwFormId } from './FeedbackForm';

async function takeScreenshot(subject, config = {}) {
  // Convert the page into a "clean" html document that inlines all styles, images, etc.
  const htmlDocument = capture(OutputType.OBJECT, subject, config);

  // Remove srcset from Gatsby images - it messes with the drawn image of the html
  const imgs = htmlDocument.querySelectorAll('img[srcset]');
  imgs.forEach((img) => {
    img.removeAttribute('srcset');
  });

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
        fwFormId, // Don't include the feedback form
        fwTooltipId, // Don't include any button/star tooltips
        fwInstructionsId, // Don't include instruction overlay
        fwExitButtonId, // Don't include the X button
        fabChatbot, // Don't include the FAB chatbot
        widgetsContainer, // Don't include Widgets Container (visible on mobile)
      ],
    }));
  return dataUri;
}

export async function retrieveDataUri() {
  const dataUri = await takeFeedbackScreenshot();
  return dataUri;
}
