import * as handleScreenshot from '../../../src/components/Widgets/FeedbackWidget/handleScreenshot';

export const screenshotFunctionMocks = {};
export function mockScreenshotFunctions() {
  screenshotFunctionMocks['addEventListener'] = jest
    .spyOn(document, 'addEventListener')
    .mockImplementation((mousemove, handleElementHighlight) => {
      return { mousemove, handleElementHighlight };
    });

  screenshotFunctionMocks['retrieveDataUri'] = jest
    .spyOn(handleScreenshot, 'retrieveDataUri')
    .mockImplementation(() => {
      return 'dataUri retrieved successfully';
    });
}

export const clearMockScreenshotFunctions = () => {
  Object.keys(screenshotFunctionMocks).forEach((mockedFunctionName) => {
    screenshotFunctionMocks[mockedFunctionName].mockClear();
  });
};
