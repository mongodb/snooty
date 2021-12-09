import * as realm from '../../src/components/Widgets/FeedbackWidget/realm';
import { BSON } from 'realm-web';
import { FEEDBACK_QUALIFIERS_POSITIVE, FEEDBACK_QUALIFIERS_NEGATIVE } from '../unit/data/FeedbackWidget';

export const realmFunctionMocks = {};
export function mockRealmFunctions() {
  realmFunctionMocks['createNewFeedback'] = jest
    .spyOn(realm, 'createNewFeedback')
    .mockImplementation(({ page, user, ...rest }) => {
      return {
        _id: new BSON.ObjectId(),
        page,
        user,
        ...rest,
      };
    });

  realmFunctionMocks['updateFeedback'] = jest
    .spyOn(realm, 'updateFeedback')
    .mockImplementation(({ feedback_id, ...fields }) => {
      let qualifiers = fields.qualifiers || [];
      if (Object.keys(fields).includes('rating')) {
        qualifiers = fields.rating > 3 ? FEEDBACK_QUALIFIERS_POSITIVE : FEEDBACK_QUALIFIERS_NEGATIVE;
      }
      return { _id: feedback_id, qualifiers, ...fields };
    });

  realmFunctionMocks['submitFeedback'] = jest.spyOn(realm, 'submitFeedback').mockImplementation(({ feedback_id }) => {
    return { _id: feedback_id };
  });

  realmFunctionMocks['abandonFeedback'] = jest.spyOn(realm, 'abandonFeedback').mockImplementation(({ feedback_id }) => {
    return true;
  });

  realmFunctionMocks['addAttachment'] = jest
    .spyOn(realm, 'addAttachment')
    .mockImplementation(({ feedback_id, attachment }) => {
      return {
        _id: feedback_id,
        attachments: [attachment],
      };
    });

  realmFunctionMocks['useRealmUser'] = jest.spyOn(realm, 'useRealmUser').mockImplementation(() => {
    return {
      id: 'test-user-id',
    };
  });
}
export const clearMockRealmFunctions = () => {
  Object.keys(realmFunctionMocks).forEach((mockedFunctionName) => {
    realmFunctionMocks[mockedFunctionName].mockClear();
  });
};
