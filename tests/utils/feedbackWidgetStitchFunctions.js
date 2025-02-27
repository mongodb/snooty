import * as Realm from 'realm-web';
import * as realm from '../../src/components/Widgets/FeedbackWidget/realm';

export const stitchFunctionMocks = {};
export function mockStitchFunctions() {
  stitchFunctionMocks['upsertFeedback'] = jest
    .spyOn(realm, 'upsertFeedback')
    .mockImplementation(({ page, user, ...rest }) => {
      return {
        _id: rest.feedback_id ?? new Realm.BSON.ObjectId(),
        page,
        user,
        ...rest,
      };
    });

  stitchFunctionMocks['useRealmUser'] = jest.spyOn(realm, 'useRealmUser').mockImplementation(() => {
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
