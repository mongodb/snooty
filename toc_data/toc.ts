import type { TocItem } from '../src/components/UnifiedSidenav/UnifiedConstants';

//these have to match whatever values we use to store local storage in
const COMMANDLINE_TOOLS = 'database-tools';
const CLOUD_DOCS = 'cloud-docs';
const CSHARP = 'csharp';

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
    {
      label: 'C# Quick Start',
      url: '/docs/drivers/csharp/:version',
      glyph: 'Bulb',
      prefix: CSHARP,
      versionDropdown: true,
      items: [
        {
          label: 'C# Documentation',
          group: true,

          items: [
            {
              label: 'Quick Reference',
              url: '/docs/drivers/csharp/:version/quick-reference/',
            },
            {
              label: 'Usage Examples',
              url: '/docs/drivers/csharp/:version/usage-examples',
              collapsible: true,
              items: [
                {
                  label: 'Find a Document',
                  url: '/docs/drivers/csharp/:version/usage-examples/findOne/',
                },
                {
                  label: 'Find Multiple Documents',
                  url: '/docs/drivers/csharp/:version/usage-examples/findMany/',
                },
                {
                  label: 'Insert a Document',
                  url: '/docs/drivers/csharp/:version/usage-examples/insertOne',
                },
              ],
            },
            {
              label: "What's New",
              url: '/docs/drivers/csharp/:version/whats-new',
            },
          ],
        },
        {
          label: 'Fundamentals',
          group: true,
          items: [
            {
              label: 'Operations with Builders',
              url: '/docs/drivers/csharp/fundamentals/builders',
            },
            {
              label: 'Databases and Collections',
              url: '/docs/drivers/csharp/fundamentals/database-collection',
              collapsible: true,
              items: [
                {
                  label: 'Run a Database Command',
                  url: '/docs/drivers/csharp/fundamentals/databases-collections/run-command',
                },
              ],
            },
          ],
        },
        {
          label: 'Connect to cloud',
          group: true,
          prefix: '/docs/drivers/csharp/master/cloud-docs/bianca.laube/DOP-5371',
          items: [
            {
              label: 'Manage Clusters',
              url: '/docs/drivers/csharp/manage-database-deployments',
              collapsible: true,
              items: [
                {
                  label: 'Storage',
                  url: '/docs/drivers/csharp/customize-storage',
                },
                {
                  label: 'Auto-Scaling',
                  url: '/docs/drivers/csharp/cluster-autoscaling',
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
