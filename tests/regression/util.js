require('dotenv').config({ path: './.env.production' });

const { execSync } = require('child_process');
const userInfo = require('os').userInfo;

const getGitBranch = () => {
  return execSync('git rev-parse --abbrev-ref HEAD')
    .toString('utf8')
    .replace(/[\n\r\s]+$/, '');
};

const gatsbyPrefix = `${process.env.SITE}/${userInfo().username}/${getGitBranch()}`;
export const prodUrl = `https://docs.mongodb.com/${process.env.SITE}/${process.env.PARSER_BRANCH}`;
export const localUrl = `http://127.0.0.1:9000/${gatsbyPrefix}`;

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
export const cleanString = str => {
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

const setUpPage = async (baseUrl, slug, storageObj, interactWithPage = undefined) => {
  const page = await browser.newPage();
  await page.goto(`${baseUrl}/${slug}`);

  if (interactWithPage && typeof interactWithPage === 'function') {
    await interactWithPage(page, slug, storageObj);
  }
  return page;
};

export const getPageText = async (baseUrl, slug, storageObj, getTargetClass, interactWithPage = undefined) => {
  const page = await setUpPage(baseUrl, slug, storageObj, interactWithPage);
  const className = getTargetClass && typeof getTargetClass === 'function' ? getTargetClass(slug) : '.body';
  const bodyElement = await page.$(className);
  return page.evaluate(element => Promise.resolve(element.innerText), bodyElement);
};

export const getPageLinks = async (
  baseUrl,
  slug,
  storageObj,
  interactWithPage = undefined,
  filterLinks = undefined
) => {
  const page = await setUpPage(baseUrl, slug, storageObj, interactWithPage);
  let hrefs = await page.$$eval(
    '.body a',
    (as, url) => {
      return as.reduce((acc, a) => {
        if (a.className === 'headerlink' || a.offsetWidth > 0 || a.offsetHeight > 0) {
          acc[a.text.trim()] = a.href
            .replace(url.replace('https://', 'http://'), '')
            .replace(url, '')
            .replace('https://', 'http://')
            .replace('/#', '#')
            .replace(/\/$/, '');
        }
        return acc;
      }, {});
    },
    baseUrl
  );

  if (filterLinks && typeof filterLinks === 'function') {
    hrefs = filterLinks(hrefs, baseUrl, storageObj, slug);
  }

  return hrefs;
};

/*
 * Return the text that is displayed in a table of contents.
 * The class surrounding the TOC must be passed as an argument.
 */
export const getClassText = async (baseUrl, slug, tocClass) => {
  const page = await browser.newPage();
  await page.goto(`${baseUrl}/${slug}`);
  const tocElement = await page.$(tocClass);
  return page.evaluate(element => Promise.resolve(element.innerText), tocElement);
};
