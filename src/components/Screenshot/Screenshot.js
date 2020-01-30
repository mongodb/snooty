import { capture, OutputType } from 'html-screen-capture-js';
import rasterizeHTML from 'rasterizehtml';

export function getViewport() {
  return {
    width: Math.min(document.documentElement.clientWidth, window.innerWidth || 0),
    height: Math.min(document.documentElement.clientHeight, window.innerHeight || 0),
    scrollY: Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop || 0),
    scrollX: Math.max(window.pageXOffset, document.documentElement.scrollLeft, document.body.scrollLeft || 0),
  };
}

export async function takeScreenshotOfDocument() {
  const htmlDocument = capture(OutputType.OBJECT, document, {
    classesOfIgnoredDocBodyElements: ['feedback-form'],
  });

  const { image } = await rasterizeHTML.drawHTML(htmlDocument.innerHTML);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.canvas.width = image.width;
  ctx.canvas.height = image.height;
  ctx.drawImage(image, 0, 0, image.width, image.height);

  const dataUri = canvas.toDataURL('image/png');
  return dataUri;
}
