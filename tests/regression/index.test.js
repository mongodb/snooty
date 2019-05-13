import { DEPLOYMENTS, LANGUAGES, PLATFORMS, stringifyTab } from '../../src/constants';
import { slugArray } from '../../src/testsetup';

const prodUrl = 'https://docs.mongodb.com/guides/';
const localUrl = `http://127.0.0.1:9000/${process.env.GATSBY_PREFIX}/`;
const gatsbyPrefix = process.env.GATSBY_PREFIX;

const defaultStorageObj = {
  cloud: 'cloud',
  drivers: 'shell',
  platforms: 'windows',
};

const driverToLang = {
  'java-sync': 'javasync',
};

const convertToLegacy = string => {
  return driverToLang[string] || string;
};

const guidesLanguages = ['shell', 'compass', 'python', 'java-sync', 'nodejs', 'motor', 'csharp', 'motor', 'go'];

/*
 * Replace characters to standardize between the two builders.
 * - Trim whitespace from beginning and end of each line (mostly affects codeblocks)
 * - Replace curly single quotes with straight single quotes
 * - Replace curly double quotes with straight double quotes
 * - Replace en dashes with double hyphens
 * - Replace ellipses with 3 periods
 * - Remove blank lines/whitespace
 */
const cleanString = str => {
  const trimmedStrs = str
    .split('\n')
    .map(line => line.trim())
    .join('\n');
  return trimmedStrs
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace('–', '--')
    .replace('…', '...')
    .replace(/^\s*[\r\n]/gm, '');
};

/*
 * Remove discrepancies we have found with the old build system.
 * - Remove an admonition that was appearing when 'cloud' deployment was selected, even though it should only show during 'local'
 * - Prettify pill selection at the top of the page to match our implementation in Snooty
 */
const cleanOldString = str => {
  let strWithoutAdmonition = str;
  if (str.includes('Deployment Type: cloud')) {
    strWithoutAdmonition = str.replace(
      'Enable Auth on your local instance of MongoDB.\n\nWARNING\n\nIf you are running MongoDB locally and have not enabled authentication, your MongoDB instance is not secure.',
      ''
    );
  }
  return strWithoutAdmonition
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
};

const setLocalStorage = async (slug, page, parentKey, storageObj) => {
  return page.evaluate(
    (key, value) => {
      localStorage.clear();
      localStorage.setItem(key, JSON.stringify(value));
    },
    parentKey,
    storageObj
  );
};

const getLinksFromUrl = async (baseUrl, slug, prefix, parentKey = undefined, obj = undefined) => {
  const page = await browser.newPage();
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

const getTextFromUrl = async (baseUrl, slug, { cloud, drivers, platforms }) => {
  const page = await browser.newPage();
  await page.goto(`${baseUrl}${slug}`);
  await page.click(`li[data-tabid="${cloud}"]`).catch(() => {});
  await page.click(`li[data-tabid="${drivers}"]`).catch(() => {});
  await page.click(`li[data-tabid="${platforms}"]`).catch(() => {});
  const bodyElement = await page.$('.body');
  return page.evaluate(element => Promise.resolve(element.innerText), bodyElement);
};

const runComparisons = async (slug, storageObj = {}) => {
  const key = Object.keys(storageObj)[0];
  const val = Object.values(storageObj)[0];
  return Promise.all([
    getTextFromUrl(prodUrl, slug, {
      ...defaultStorageObj,
      [key]: convertToLegacy(val),
    }),
    getTextFromUrl(localUrl, slug, {
      ...defaultStorageObj,
      ...storageObj,
    }),
  ]);
};

const slugs = slugArray;
describe('with default local storage', () => {
  describe.each(slugs)('%p', slug => {
    describe('compare text', () => {
      it(`file text is the same`, async () => {
        expect.assertions(1);

        const [legacyText, snootyText] = await runComparisons(slug);
        return expect(cleanString(snootyText)).toEqual(cleanString(cleanOldString(legacyText)));
      }, 1500000);
    });

    describe('compare links', () => {
      let oldLinks;
      let newLinks;

      beforeEach(async () => {
        [oldLinks, newLinks] = await Promise.all([
          await getLinksFromUrl(prodUrl, slug, gatsbyPrefix, 'tabPref', {
            cloud: 'cloud',
            languages: 'shell',
            platforms: 'windows',
          }),
          await getLinksFromUrl(await browser.newPage(), localUrl, slug, gatsbyPrefix, 'mongodb-docs', {
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
      it(`deployment file text is the same`, async () => {
        const [legacyText, snootyText] = await runComparisons(slug, {
          cloud: deployment,
        });
        return expect(cleanString(snootyText)).toEqual(cleanString(cleanOldString(legacyText)));
      }, 1500000);
    });

    describe.each(guidesLanguages)('language: %p', language => {
      it(`language file text is the same`, async () => {
        const [legacyText, snootyText] = await runComparisons(slug, {
          drivers: language,
        });
        return expect(cleanString(snootyText)).toEqual(cleanString(cleanOldString(legacyText)));
      }, 1500000);
    });

    describe.each(PLATFORMS)('platform: %p', platform => {
      it(`platform file text is the same`, async () => {
        const [legacyText, snootyText] = await runComparisons(slug, {
          platforms: platform,
        });
        return expect(cleanString(snootyText)).toEqual(cleanString(cleanOldString(legacyText)));
      }, 1500000);
    });
  });
});
