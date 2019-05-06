import { DEPLOYMENTS, LANGUAGES, PLATFORMS, stringifyTab } from '../../src/constants';
import { slugArray } from '../../src/testsetup';

const prodUrl = 'https://docs.mongodb.com/guides/';
const localUrl = `http://127.0.0.1:9000/${process.env.GATSBY_PREFIX}/`;
const gatsbyPrefix = process.env.GATSBY_PREFIX;

/*
 * Replace characters to standardize between the two builders. Sphinx uses smart quotes, dashes, etc. and Snooty does not yet.
 * - Replace curly single quotes with straight single quotes
 * - Replace curly double quotes with straight double quotes
 * - Replace en dashes with double hyphens
 * - Replace ellipses with 3 periods
 * - Remove blank lines/whitespace
 */
const cleanString = str =>
  str
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace('–', '--')
    .replace('…', '...')
    .replace(/^\s*[\r\n]/gm, '');

/*
 * Remove discrepancies we have found with the old build system.
 * - Remove an admonition that was appearing when 'cloud' deployment was selected, even though it should only show during 'local'
 * - Prettify pill selection at the top of the page to match our implementation in Snooty
 */
const cleanOldString = str =>
  str
    .replace(
      'Enable Auth on your local instance of MongoDB.\n\nWARNING\n\nIf you are running MongoDB locally and have not enabled authentication, your MongoDB instance is not secure.',
      ''
    )
    .replace(/Deployment Type: \w+/gi, word => {
      const words = word.split(':');
      const choice = stringifyTab(words[1].trim());
      return `${words[0]}: ${choice}`;
    })
    .replace(/Client: \w+/gi, word => {
      const words = word.split(':');
      const choice = stringifyTab(words[1].trim());
      return `${words[0]}: ${choice}`;
    });

const setLocalStorage = async (page, parentKey, storageObj) => {
  await page.evaluate(
    (key, value) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
    parentKey,
    storageObj
  );
};

const getLinksFromUrl = async (page, baseUrl, slug, prefix, parentKey = undefined, obj = undefined) => {
  await page.goto(`${baseUrl}${slug}`);
  if (parentKey && obj) {
    await setLocalStorage(page, parentKey, obj);
  }
  const hrefs = await page.$$eval(
    '.body a',
    (as, localPrefix) => {
      return as.reduce((acc, a) => {
        acc[a.text] = a.href
          .replace(`/${localPrefix}`, '')
          .replace('http://docs.mongodb.com/guides', '')
          .replace('https://docs.mongodb.com/guides', '')
          .replace('http://127.0.0.1:9000', '')
          .replace(/\/$/, '');
        return acc;
      }, {});
    },
    prefix
  );
  return hrefs;
};

const getTextFromUrl = async (page, baseUrl, slug, parentKey = undefined, obj = undefined) => {
  await page.goto(`${baseUrl}${slug}`);
  if (parentKey && obj) {
    await setLocalStorage(page, parentKey, obj);
  }
  const bodyElement = await page.$('.body');
  return page.evaluate(element => element.innerText, bodyElement);
};

const slugs = slugArray;
describe('with default local storage', () => {
  describe.each(slugs)('%p', slug => {
    describe('compare text', () => {
      let legacyText;
      let snootyText;
      beforeEach(async () => {
        [legacyText, snootyText] = await Promise.all([
          getTextFromUrl(await browser.newPage(), prodUrl, slug, 'tabPref', { cloud: 'cloud', languages: 'shell' }),
          getTextFromUrl(await browser.newPage(), localUrl, slug, 'mongodb-docs', { cloud: 'cloud', drivers: 'shell' }),
        ]);
      });

      it(`file text is the same`, () => {
        legacyText = cleanString(cleanOldString(legacyText));
        snootyText = cleanString(snootyText);
        expect(legacyText).toEqual(snootyText);
      });
    });

    describe('compare links', () => {
      let oldLinks;
      let newLinks;

      beforeEach(async () => {
        [oldLinks, newLinks] = await Promise.all([
          getLinksFromUrl(await browser.newPage(), prodUrl, slug, gatsbyPrefix, 'tabPref', {
            cloud: 'cloud',
            languages: 'shell',
            platforms: 'windows',
          }),
          getLinksFromUrl(await browser.newPage(), localUrl, slug, gatsbyPrefix, 'mongodb-docs', {
            cloud: 'cloud',
            drivers: 'shell',
            platforms: 'windows',
          }),
        ]);
      });

      it(`links are the same`, () => {
        expect(oldLinks).toEqual(newLinks);
      });
    });
  });
});

describe('with local storage', () => {
  describe.each(slugs)('%p', slug => {
    describe.each(DEPLOYMENTS)('deployment: %p', deployment => {
      let legacyText;
      let snootyText;
      beforeEach(async () => {
        [legacyText, snootyText] = await Promise.all([
          getTextFromUrl(await browser.newPage(), prodUrl, slug, 'tabPref', {
            cloud: deployment,
            languages: 'shell',
            platforms: 'windows',
          }),
          getTextFromUrl(await browser.newPage(), localUrl, slug, 'mongodb-docs', {
            cloud: deployment,
            drivers: 'shell',
            platforms: 'windows',
          }),
        ]);
      });

      it(`file text is the same`, () => {
        legacyText = cleanString(cleanOldString(legacyText));
        snootyText = cleanString(snootyText);
        expect(legacyText).toEqual(snootyText);
      });
    });

    describe.each(LANGUAGES)('language: %p', language => {
      let legacyText;
      let snootyText;
      beforeEach(async () => {
        [legacyText, snootyText] = await Promise.all([
          getTextFromUrl(await browser.newPage(), prodUrl, slug, 'tabPref', {
            cloud: 'cloud',
            languages: language,
            platforms: 'windows',
          }),
          getTextFromUrl(await browser.newPage(), localUrl, slug, 'mongodb-docs', {
            cloud: 'cloud',
            drivers: language,
            platforms: 'windows',
          }),
        ]);
      });

      it(`file text is the same`, () => {
        legacyText = cleanString(cleanOldString(legacyText));
        snootyText = cleanString(snootyText);
        expect(legacyText).toEqual(snootyText);
      });
    });

    describe.each(PLATFORMS)('platform: %p', platform => {
      let legacyText;
      let snootyText;
      beforeEach(async () => {
        [legacyText, snootyText] = await Promise.all([
          getTextFromUrl(await browser.newPage(), prodUrl, slug, 'tabPref', {
            cloud: 'cloud',
            languages: 'shell',
            platforms: platform,
          }),
          getTextFromUrl(await browser.newPage(), localUrl, slug, 'mongodb-docs', {
            cloud: 'cloud',
            drivers: 'shell',
            platforms: platform,
          }),
        ]);
      });

      it(`file text is the same`, () => {
        legacyText = cleanString(cleanOldString(legacyText));
        snootyText = cleanString(snootyText);
        expect(legacyText).toEqual(snootyText);
      });
    });
  });
});
