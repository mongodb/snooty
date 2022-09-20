import * as stitch from '../../src/components/Widgets/FeedbackWidget/stitch';
import { BSON } from 'mongodb-stitch-server-sdk';

export const stitchFunctionMocks = {};
export function mockStitchFunctions() {
  stitchFunctionMocks['createNewFeedback'] = jest
    .spyOn(stitch, 'createNewFeedback')
    .mockImplementation(({ page, user, ...rest }) => {
      return {
        _id: new BSON.ObjectId(),
        page,
        user,
        ...rest,
      };
    });

  stitchFunctionMocks['useStitchUser'] = jest.spyOn(stitch, 'useStitchUser').mockImplementation(() => {
    return {
      id: 'test-user-id',
    };
  });
}
export const clearMockStitchFunctions = () => {
  Object.keys(stitchFunctionMocks).forEach((mockedFunctionName) => {
    stitchFunctionMocks[mockedFunctionName].mockClear();
  });
};
