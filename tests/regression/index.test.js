import { diffLines } from 'diff';
import { LANGUAGES, DEPLOYMENTS } from '../../src/constants';
import { fromString } from 'html-to-text';

const slugs = [
  'cloud/atlas',
  'cloud/connectionstring',
  'cloud/migrate-from-aws-to-atlas',
  'cloud/migrate-from-compose',
  'cloud/migrate-from-mlab',
  'server/auth',
  'server/delete',
  'server/drivers',
  'server/import',
  'server/insert',
  'server/install',
  'server/introduction',
  'server/read',
  'server/read_operators',
  'server/read_queries',
  'server/update',
];

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

describe('testing all languages and deployments', () => {
  LANGUAGES.forEach(language => {
    DEPLOYMENTS.forEach(deployment => {
      slugs.forEach(slug => {
        test(`${slug} [language: ${language}] [deployment: ${deployment}]`, async () => {
          const oldPage = await browser.newPage();
          await oldPage.goto(`${oldUrl}${slug}`);

          await oldPage.evaluate(
            (deployment, language) => {
              localStorage.setItem('tabPref', JSON.stringify({ cloud: deployment, languages: language }));
            },
            deployment,
            language
          );

          const oldElement = await oldPage.$(`div[data-pagename="${slug}"]`);
          const oldText = await oldPage.evaluate(element => element.innerText, oldElement);

          const newPage = await browser.newPage();
          await newPage.goto(`${localUrl}${slug}`);

          await newPage.evaluate(
            (deployment, language) => {
              localStorage.setItem('mongodb-docs', JSON.stringify({ cloud: deployment, languages: language }));
            },
            deployment,
            language
          );

          const newElement = await newPage.$(`div[data-pagename="${slug}"]`);
          const newText = await newPage.evaluate(element => element.innerText, newElement);

          const changeObjects = diffLines(cleanString(oldText), cleanString(newText), {
            ignoreWhitespace: true,
            newlineIsToken: true,
          }).filter(
            obj =>
              (Object.prototype.hasOwnProperty.call(obj, 'added') ||
                Object.prototype.hasOwnProperty.call(obj, 'removed')) &&
              !obj.value.includes('Deployment Type:') &&
              !obj.value.includes('Client:')
          );
          expect(changeObjects).toEqual([]);
        });
      });
    });
  });
});
