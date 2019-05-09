import { DEPLOYMENTS, LANGUAGES, PLATFORMS, stringifyTab } from '../../src/constants';
import { slugArray } from '../../src/testsetup';

const prodUrl = 'https://docs.mongodb.com/guides/';
const localUrl = `http://127.0.0.1:9000/${process.env.GATSBY_PREFIX}/`;
const gatsbyPrefix = process.env.GATSBY_PREFIX;

const defaultStorageObj = {
  cloud: 'cloud',
  drivers: 'shell',
  languages: 'shell',
  platforms: 'windows',
};

const driverToLang = {
  shell: 'shell',
  compass: 'compass',
  python: 'python',
  'java-sync': 'javasync',
  nodejs: 'nodejs',
  motor: 'motor',
  csharp: 'csharp',
  go: 'go',
};

const guidesLanguages = ['shell', 'compass', 'python', 'java-sync', 'nodejs', 'motor', 'csharp', 'motor', 'go'];

/*
 * Replace characters to standardize between the two builders. Sphinx uses smart quotes, dashes, etc. and Snooty does not yet.
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

const setLocalStorage = async (page, parentKey, storageObj) => {
  await page.evaluate(
    (key, value) => {
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

const getTextFromUrl = async (baseUrl, slug, pill = undefined, parentKey = undefined, localStorageObj = undefined) => {
  const page = await browser.newPage();
await page.goto(`${baseUrl}${slug}`);
  if (await page.$('ul[data-tab-preference="languages"]')) {
    const pageContainsTab = await page.$$eval(
      'ul[data-tab-preference="languages"] .guide__pill',
      (lis, dataPill) => {
        const pillsOnPage = lis.map(li => li.dataset.tabid.replace('-', ''));
        return pillsOnPage.some(p => p === dataPill.replace('-', ''));
      },
      pill
    );
    if (!pageContainsTab) {
      console.log(slug, pill, 'DOES NOT CONTAIN TAB');
      return '';
    }
  }
  await setLocalStorage(page, parentKey, localStorageObj);
  const bodyElement = await page.$('.body');
  return page.evaluate(element => element.innerText, bodyElement);
};

const runComparisons = async (slug, legacyStorageObj = defaultStorageObj, snootyStorageObj = legacyStorageObj) => {
  const pill = legacyStorageObj.languages || snootyStorageObj.drivers;
  return Promise.all([
    getTextFromUrl(prodUrl, slug, pill, 'tabPref', {
      ...defaultStorageObj,
      ...legacyStorageObj,
    }),
    getTextFromUrl(localUrl, slug, pill, 'mongodb-docs', {
      ...defaultStorageObj,
      ...snootyStorageObj,
    }),
  ]);
};

const slugs = slugArray;
describe('with default local storage', () => {
  describe.each(slugs)('%p', slug => {
    describe.only('compare text', () => {
      let legacyText;
      let snootyText;
      beforeEach(async () => {
        [legacyText, snootyText] = await runComparisons(slug);
      });

      it(`file text is the same`, () => {
        legacyText = cleanString(cleanOldString(legacyText));
        snootyText = cleanString(snootyText);
        expect(snootyText).toEqual(legacyText);
      });
    });

    describe('compare links', () => {
      let oldLinks;
      let newLinks;

      beforeEach(async () => {
        [oldLinks, newLinks] = await Promise.all([
          getLinksFromUrl(prodUrl, slug, gatsbyPrefix, 'tabPref', {
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
        [legacyText, snootyText] = await runComparisons(slug, { cloud: deployment });
      });

      it(`file text is the same`, () => {
        legacyText = cleanString(cleanOldString(legacyText));
        snootyText = cleanString(snootyText);
        expect(snootyText).toEqual(legacyText);
      });
    });

    describe.each(guidesLanguages)('language: %p', language => {
      let legacyText;
      let snootyText;
      beforeEach(async () => {
        [legacyText, snootyText] = await runComparisons(
          slug,
          { languages: driverToLang[language] },
          { drivers: language }
        );
      });

      it(`file text is the same`, () => {
        legacyText = cleanString(cleanOldString(legacyText));
        snootyText = cleanString(snootyText);
        expect(snootyText).toEqual(legacyText);
      });
    });

    describe.each(PLATFORMS)('platform: %p', platform => {
      let legacyText;
      let snootyText;
      beforeEach(async () => {
        [legacyText, snootyText] = await runComparisons(slug, { platforms: platform });
      });

      it(`file text is the same`, () => {
        legacyText = cleanString(cleanOldString(legacyText));
        snootyText = cleanString(snootyText);
        expect(snootyText).toEqual(legacyText);
      });
    });
  });
});
