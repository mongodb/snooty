import type { TocItem } from '../src/components/UnifiedSidenav/UnifiedConstants';

const COMMANDLINE_TOOLS = 'database-tools';
const CLOUD_DOCS = 'cloud-docs';

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
    {
      label: 'Atlas',
      url: '/docs/atlas/getting-started/',
      prefix: CLOUD_DOCS,
      items: [
        {
          label: 'Application Development',
          group: true,
          items: [
            {
              label: 'Connect to Clusters',
              url: '/docs/atlas/connect-to-database-deployment',
              collapsible: true,
              items: [
                {
                  label: 'Drivers',
                  url: '/docs/atlas/driver-connection',
                },
                {
                  label: 'Compass',
                  url: '/docs/atlas/compass-connection',
                },
                {
                  label: 'mongosh',
                  url: '/docs/atlas/mongo-shell-connection',
                },
                {
                  collapsible: true,
                  label: 'BI Connector',
                  url: '/docs/atlas/bi-connection',
                  items: [
                    {
                      label: 'Transition to Atlas SQL',
                      url: '/docs/atlas/tutorial/transition-bic-to-atlas-sql',
                    },
                    {
                      label: 'System DSN',
                      url: '/docs/atlas/tutorial/create-system-dsn',
                    },
                  ],
                },
              ],
            },
            {
              label: 'Command Line Tools',
              url: '/docs/atlas/command-line-tools',
            },
            {
              label: 'VS Code',
              url: '/docs/atlas/mongodb-for-vscode',
            },
          ],
        },
      ],
    },
  ];

  return toc;
};
