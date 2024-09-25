import { constructHowToSd } from '../../../src/utils/structured-data';
import stepsData from '../../utils/data/how-to-structured-data.json';

describe('Structured Data', () => {
  describe('HowTo Structured Data', () => {
    it('converts steps into expected structured data format', () => {
      console.log(stepsData);
      const howToSd = constructHowToSd({ steps: stepsData });
      expect(howToSd).toMatchSnapshot();
    });
  });
});
