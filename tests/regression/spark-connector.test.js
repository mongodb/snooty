import { slugArray } from '../../src/regressionTestSetup';
import { cleanString, getTextFromUrl, localUrl, prodUrl } from './util';

describe('landing page', () => {
  it(`page text is the same`, async () => {
    const [legacyText, snootyText] = await Promise.all([
      await getTextFromUrl(prodUrl, ''),
      await getTextFromUrl(localUrl, ''),
    ]);
    expect(cleanString(snootyText)).toEqual(cleanString(legacyText));
  });
});

describe.each(slugArray)('%p', slug => {
  it(`page text is the same`, async () => {
    const [legacyText, snootyText] = await Promise.all([
      await getTextFromUrl(prodUrl, slug),
      await getTextFromUrl(localUrl, slug),
    ]);
    expect(cleanString(snootyText)).toEqual(cleanString(legacyText));
  });
});
