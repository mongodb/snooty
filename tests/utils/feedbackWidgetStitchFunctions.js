import { jest } from '@jest/globals';
import * as Realm from 'realm-web';
import * as realm from '../../src/components/Widgets/FeedbackWidget/realm';

export const stitchFunctionMocks = {};
export function mockStitchFunctions() {
  stitchFunctionMocks['createNewFeedback'] = jest
    .spyOn(realm, 'createNewFeedback')
    .mockImplementation(({ page, user, ...rest }) => {
      return {
        _id: new Realm.BSON.ObjectId(),
        page,
        user,
        ...rest,
      };
    });

  stitchFunctionMocks['useRealmUser'] = jest.spyOn(realm, 'useRealmUser').mockImplementation(() => {
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
