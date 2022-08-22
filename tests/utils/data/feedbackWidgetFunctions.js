import * as useScreenshot from '../../../src/components/Widgets/FeedbackWidget/hooks/useScreenshot';
// import * as ScreenshotButton from '../../../src/components/Widgets/FeedbackWidget/components/ScreenshotButton';

export const fwFunctionMocks = {};
export function mockFWFunctions() {
  fwFunctionMocks['addEventListener'] = jest
    .spyOn(document, 'addEventListener')
    .mockImplementation((mousemove, handleElementHighlight) => {
      return { mousemove, handleElementHighlight };
    });

  // why is this being called before the send button is clicked?
  fwFunctionMocks['useScreenshot'] = jest.spyOn(useScreenshot, 'default').mockImplementation(() => 'screenshot taken');

  fwFunctionMocks['takeScreenshot'] = jest
    .spyOn(useScreenshot, 'takeScreenshot')
    .mockImplementation((subject, config = {}) => {
      // return {
      //   subject, config
      // };
      return 'screenshot taken';
    });

  // jest.spyOn(useActiveHeading, 'default').mockImplementation(() => 'atlas');
}

export const clearMockFWFunctions = () => {
  Object.keys(fwFunctionMocks).forEach((mockedFunctionName) => {
    fwFunctionMocks[mockedFunctionName].mockClear();
  });
};
