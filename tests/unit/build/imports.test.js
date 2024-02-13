import { componentMap } from '../../../plugins/gatsby-source-snooty-prod/pages/ComponentFactory/imports';

it('returns the entire map when no argument is provided', async () => {
  await expect(Object.keys(await componentMap()).length).toBe(72);
});

it('filters on provided directives', async () => {
  const components = Object.keys(await componentMap(['admonition']));
  expect(components.length).toBe(1);
});
