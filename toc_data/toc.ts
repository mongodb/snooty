import type { TocItem } from '../src/components/UnifiedSidenav/UnifiedConstants';

const COMMANDLINE_TOOLS = 'database-tools';

// each url has to be unique with the prefix!!!!
export const tocData = (): TocItem[] => {
  const toc: TocItem[] = [
    {
      label: 'Database tools',
      url: '/docs/database-tools/',
      prefix: COMMANDLINE_TOOLS,
      items: [
        {
          label: 'command tools',
          group: true,
          items: [
            {
              label: 'mongodump',
              url: '/docs/database-tools/mongodump/',
              collapsible: true,
              items: [
                {
                  label: 'Compatibility & Installation',
                  url: '/docs/database-tools/mongorestore/mongorestore-compatibility-and-installation/',
                },
                {
                  label: 'Behavior',
                  url: '/docs/database-tools/mongodump/mongodump-behavior/',
                },
                {
                  label: 'mongodbrestore',
                  url: '/docs/database-tools/mongorestore/',
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  return toc;
};
