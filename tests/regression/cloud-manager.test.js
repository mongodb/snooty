import { slugArray } from '../../src/regressionTestSetup';
import { cleanString, getPageText, localUrl } from './util';

const prodUrl = 'https://docs.cloudmanager.mongodb.com';

describe('landing page', () => {
  it(`page text is the same`, async () => {
    const [legacyText, snootyText] = await Promise.all([
      await getPageText(prodUrl, ''),
      await getPageText(localUrl, ''),
    ]);
    expect(cleanString(snootyText)).toEqual(cleanString(legacyText));
  });
});

describe.each(slugArray)('%p', slug => {
  it(`page text is the same`, async () => {
    const [legacyText, snootyText] = await Promise.all([
      await getPageText(prodUrl, slug),
      await getPageText(localUrl, slug),
    ]);
    expect(cleanString(snootyText)).toEqual(cleanString(legacyText));
  });
});
