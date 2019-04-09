import { diffLines } from 'diff';
import { DEPLOYMENTS, LANGUAGES, PLATFORMS } from '../../src/constants';
import { slugArray } from '../../src/testsetup';

const oldUrl = 'https://docs.mongodb.com/guides/';
const localUrl = 'http://127.0.0.1:9000/';

/*
 * Replace characters to standardize between the two builders.
 * The old builder replaces two hypens with an en dash.
 * The old builder automatically replaces straight quotes with left/right quotes
 */
const cleanString = str =>
  str
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace('--', '–');

const setLocalStorage = async (page, parentKey, storageObj) => {
  await page.evaluate(
    // eslint-disable-next-line no-shadow
    (parentKey, storageObj) => {
      localStorage.setItem(parentKey, JSON.stringify(storageObj));
    },
    parentKey,
    storageObj
  );
};

const getTextFromUrl = async (page, baseUrl, slug, parentKey = undefined, obj = undefined) => {
  await page.goto(`${baseUrl}${slug}`);
  if (parentKey && obj) {
    await setLocalStorage(page, parentKey, obj);
  }
  const bodyElement = await page.$(`div[data-pagename="${slug}"]`);
  return page.evaluate(element => element.innerText, bodyElement);
};

const getDiffObject = (oldText, newText) => {
  return diffLines(cleanString(oldText), cleanString(newText), {
    ignoreWhitespace: true,
    newlineIsToken: true,
  }).filter(
    obj =>
      (Object.prototype.hasOwnProperty.call(obj, 'added') || Object.prototype.hasOwnProperty.call(obj, 'removed')) &&
      !obj.value.includes('Deployment Type:') &&
      !obj.value.includes('Client:')
  );
};

const slugs = slugArray;
describe('without local storage', () => {
  describe.each(slugs)('%p', slug => {
    let oldText;
    let newText;
    beforeEach(async () => {
      [oldText, newText] = await Promise.all([
        getTextFromUrl(await browser.newPage(), oldUrl, slug),
        getTextFromUrl(await browser.newPage(), localUrl, slug),
      ]);
    });

    it(`file text is the same`, () => {
      expect(getDiffObject(oldText, newText)).toEqual([]);
    });
  });
});

describe('with local storage', () => {
  describe.each(slugs)('%p', slug => {
    describe.each(DEPLOYMENTS)('deployment: %p', deployment => {
      let oldText;
      let newText;
      beforeEach(async () => {
        [oldText, newText] = await Promise.all([
          getTextFromUrl(await browser.newPage(), oldUrl, slug, 'tabPref', { cloud: deployment }),
          getTextFromUrl(await browser.newPage(), localUrl, slug, 'mongodb-docs', { cloud: deployment }),
        ]);
      });

      it(`file text is the same`, () => {
        expect(getDiffObject(oldText, newText)).toEqual([]);
      });
    });

    describe.each(LANGUAGES)('language: %p', language => {
      let oldText;
      let newText;
      beforeEach(async () => {
        [oldText, newText] = await Promise.all([
          getTextFromUrl(await browser.newPage(), oldUrl, slug, 'tabPref', { languages: language }),
          getTextFromUrl(await browser.newPage(), localUrl, slug, 'mongodb-docs', { drivers: language }),
        ]);
      });

      it(`file text is the same`, () => {
        expect(getDiffObject(oldText, newText)).toEqual([]);
      });
    });

    describe.each(PLATFORMS)('platform: %p', platform => {
      let oldText;
      let newText;
      beforeEach(async () => {
        [oldText, newText] = await Promise.all([
          getTextFromUrl(await browser.newPage(), oldUrl, slug, 'tabPref', { platforms: platform }),
          getTextFromUrl(await browser.newPage(), localUrl, slug, 'mongodb-docs', { platforms: platform }),
        ]);
      });

      it(`file text is the same`, () => {
        expect(getDiffObject(oldText, newText)).toEqual([]);
      });
    });
  });
});
