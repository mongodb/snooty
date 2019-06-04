import { DEPLOYMENTS, PLATFORMS, stringifyTab } from '../../src/constants';
import { slugArray } from '../../src/regressionTestSetup';

require('dotenv').config({ path: './.env.production' });

const gatsbyPrefix = process.env.GATSBY_PREFIX.substr(1);
const prodUrl = 'https://docs.mongodb.com/guides/';
const localUrl = `http://127.0.0.1:9000/${gatsbyPrefix}/`;

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
 * - Normalize versions of macOS downloads to 1.0
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
    .replace(/\u2026/g, '...')
    .replace(/^\s*[\r\n]/gm, '')
    .replace(/tar -zxvf mongodb-macos-x86_64-([0-9]+).([0-9]+).tgz\n+/, 'tar -zxvf mongodb-macos-x86_64-1.0.tgz');
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

/*
 * Remove errors in the old build system
 * - The correct command is sometimes not provided for Windows executables
 */
const cleanStringByPlatform = (str, platform) => {
  let cleanStr = str;
  if (platform === 'windows') {
    cleanStr = str.replace('mongo mongodb+srv', 'mongo.exe mongodb+srv');
  }
  return cleanOldString(cleanStr);
};

/*
 * Remove errors in the old build system
 * - Migration Support should not have been rendered as a primary section, so we should not expect to find it in Snooty's TOC
 * - Remove resulting blank lines
 */
const cleanOldTOC = str => {
  return str.replace(/Migration Support/g, '').replace(/^\s*[\r\n]/gm, '');
};

const setUpPage = async (baseUrl, slug, { cloud, drivers, platforms }) => {
  const page = await browser.newPage();
  await page.goto(`${baseUrl}${slug}`);
  if (slug) {
    await page.click(`li[data-tabid="${cloud}"]`).catch(() => {});
    await page.click(`li[data-tabid="${drivers}"]`).catch(() => {});
    await page.click(`li[data-tabid="${platforms}"]`).catch(() => {});
  }
  return page;
};

const getLinksFromUrl = async (baseUrl, slug, storageObj) => {
  const page = await setUpPage(baseUrl, slug, storageObj);
  const hrefs = await page.$$eval(
    '.body a',
    (as, localPrefix, isProd, isCloud, isServerGuide) => {
      return as.reduce((acc, a) => {
        // Don't include admonition that is incorrectly shown when "Cloud" is selected on prod
        if (isProd && a.text === 'Enable Auth' && isCloud && isServerGuide) {
          return acc;
        }
        if (a.className === 'headerlink' || a.offsetWidth > 0 || a.offsetHeight > 0) {
          acc[a.text.trim()] = a.href
            .replace(`/${localPrefix}`, '')
            .replace('http://docs.mongodb.com/guides', '')
            .replace('https://docs.mongodb.com/guides', '')
            .replace('http://127.0.0.1:9000', '')
            .replace('https://', 'http://')
            .replace('/#', '#')
            .replace(/\/$/, '');
        }
        return acc;
      }, {});
    },
    gatsbyPrefix,
    baseUrl === prodUrl,
    storageObj.cloud === 'cloud',
    slug.includes('server')
  );
  return hrefs;
};

const getTextFromUrl = async (baseUrl, slug, storageObj) => {
  const page = await setUpPage(baseUrl, slug, storageObj);
  const bodyElement = slug ? await page.$('.body') : await page.$('.guide-category-list');
  return page.evaluate(element => Promise.resolve(element.innerText), bodyElement);
};

const getTOCFromUrl = async (baseUrl, slug) => {
  const page = await browser.newPage();
  await page.goto(`${baseUrl}${slug}`);
  const tocElement = await page.$('.left-toc');
  return page.evaluate(element => Promise.resolve(element.innerText), tocElement);
};

const runComparisons = async (slug, storageObj = defaultStorageObj) => {
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

describe('landing page', () => {
  it(`file text is the same`, async () => {
    expect.assertions(1);

    const [legacyText, snootyText] = await runComparisons('');
    return expect(snootyText).toEqual(legacyText);
  });
});

const slugs = slugArray;
describe('with default tabs', () => {
  describe.each(slugs)('%p', slug => {
    it(`file text is the same`, async () => {
      expect.assertions(1);

      const [legacyText, snootyText] = await runComparisons(slug);
      return expect(cleanString(snootyText)).toEqual(cleanString(cleanOldString(legacyText)));
    });

    it(`table of contents labels are the same`, async () => {
      const [oldTOC, newTOC] = await Promise.all([
        await getTOCFromUrl(prodUrl, slug),
        await getTOCFromUrl(localUrl, slug),
      ]);
      expect(newTOC).toEqual(cleanOldTOC(oldTOC));
    });

    it(`links are the same`, async () => {
      const [oldLinks, newLinks] = await Promise.all([
        await getLinksFromUrl(prodUrl, slug, defaultStorageObj),
        await getLinksFromUrl(localUrl, slug, defaultStorageObj),
      ]);
      expect(newLinks).toEqual(oldLinks);
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

      it(`deployment links are the same`, async () => {
        const [oldLinks, newLinks] = await Promise.all([
          await getLinksFromUrl(prodUrl, slug, defaultStorageObj),
          await getLinksFromUrl(localUrl, slug, defaultStorageObj),
        ]);
        expect(newLinks).toEqual(oldLinks);
      });
    });

    describe.each(guidesLanguages)('language: %p', language => {
      it(`language file text is the same`, async () => {
        const [legacyText, snootyText] = await runComparisons(slug, {
          drivers: language,
        });
        return expect(cleanString(snootyText)).toEqual(cleanString(cleanOldString(legacyText)));
      }, 1500000);

      it(`language links are the same`, async () => {
        const [oldLinks, newLinks] = await Promise.all([
          await getLinksFromUrl(prodUrl, slug, defaultStorageObj),
          await getLinksFromUrl(localUrl, slug, defaultStorageObj),
        ]);
        expect(newLinks).toEqual(oldLinks);
      });
    });

    describe.each(PLATFORMS)('platform: %p', platform => {
      it(`platform file text is the same`, async () => {
        const [legacyText, snootyText] = await runComparisons(slug, {
          platforms: platform,
        });
        return expect(cleanString(snootyText)).toEqual(cleanString(cleanStringByPlatform(legacyText, platform)));
      }, 1500000);

      it(`platform links are the same`, async () => {
        const [oldLinks, newLinks] = await Promise.all([
          await getLinksFromUrl(prodUrl, slug, defaultStorageObj),
          await getLinksFromUrl(localUrl, slug, defaultStorageObj),
        ]);
        expect(newLinks).toEqual(oldLinks);
      });
    });
  });
});
