import * as stitch from '../../src/components/Widgets/FeedbackWidget/stitch';
import { BSON } from 'mongodb-stitch-server-sdk';
import { FEEDBACK_QUALIFIERS_POSITIVE, FEEDBACK_QUALIFIERS_NEGATIVE } from '../unit/data/FeedbackWidget';

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

  stitchFunctionMocks['updateFeedback'] = jest
    .spyOn(stitch, 'updateFeedback')
    .mockImplementation(({ feedback_id, ...fields }) => {
      let qualifiers = fields.qualifiers || [];
      if (Object.keys(fields).includes('rating')) {
        qualifiers = fields.rating > 3 ? FEEDBACK_QUALIFIERS_POSITIVE : FEEDBACK_QUALIFIERS_NEGATIVE;
      }
      return { _id: feedback_id, qualifiers, ...fields };
    });

  stitchFunctionMocks['submitFeedback'] = jest.spyOn(stitch, 'submitFeedback').mockImplementation(({ feedback_id }) => {
    return { _id: feedback_id };
  });

  stitchFunctionMocks['abandonFeedback'] = jest
    .spyOn(stitch, 'abandonFeedback')
    .mockImplementation(({ feedback_id }) => {
      return true;
    });

  stitchFunctionMocks['addAttachment'] = jest
    .spyOn(stitch, 'addAttachment')
    .mockImplementation(({ feedback_id, attachment }) => {
      return {
        _id: feedback_id,
        attachments: [attachment],
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
