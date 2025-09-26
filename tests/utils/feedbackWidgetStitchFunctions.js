import * as feedbackWidget from '../../src/components/Widgets/FeedbackWidget/upsertFeedback';

export const stitchFunctionMocks = {};
export function mockStitchFunctions() {
  stitchFunctionMocks['upsertFeedback'] = jest
    .spyOn(feedbackWidget, 'upsertFeedback')
    .mockImplementation(({ page, user, ...rest }) => {
      return {
        _id: rest.feedback_id,
        page,
        user,
        ...rest,
      };
    });

  stitchFunctionMocks['useBrowserUser'] = jest.spyOn(feedbackWidget, 'useBrowserUser').mockImplementation(() => {
    return {
      user: {
        id: 'test-user-id',
      },
      // Most of this logic is dependent on Realm app working
      reassignCurrentUser: () => ({ id: 'another-test-user-id' }),
    };
  });
}
export const clearMockStitchFunctions = () => {
  Object.keys(stitchFunctionMocks).forEach((mockedFunctionName) => {
    stitchFunctionMocks[mockedFunctionName].mockClear();
  });
};
