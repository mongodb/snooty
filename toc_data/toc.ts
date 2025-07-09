import { TocItem, DocSites } from '../src/components/UnifiedSidenav/UnifiedConstants';

// each url has to be unique with the contentSite!!!!
export const tocData = (): TocItem[] => {
  const toc: TocItem[] = [
    {
      label: 'Database tools',
      url: '/docs/database-tools/',
      contentSite: DocSites.DATABASE_TOOLS,
      items: [
        {
          label: 'command tools',
          group: true,
          contentSite: DocSites.DATABASE_TOOLS,
          items: [
            {
              label: 'mongodump',
              url: '/docs/database-tools/mongodump/',
              contentSite: DocSites.DATABASE_TOOLS,
              collapsible: true,
              items: [
                {
                  label: 'Compatibility & Installation',
                  contentSite: DocSites.DATABASE_TOOLS,
                  url: '/docs/database-tools/mongodump/mongodump-compatibility-and-installation/',
                },
                {
                  label: 'Behavior',
                  contentSite: DocSites.DATABASE_TOOLS,
                  url: '/docs/database-tools/mongodump/mongodump-behavior/',
                },
                {
                  label: 'Examples',
                  contentSite: DocSites.DATABASE_TOOLS,
                  url: '/docs/database-tools/mongodump/mongodump-examples/',
                },
              ],
            },
            {
              label: 'mongorestore',
              contentSite: DocSites.DATABASE_TOOLS,
              url: '/docs/database-tools/mongorestore/',
              collapsible: true,
              items: [
                {
                  label: 'Compatibility & Installation',
                  contentSite: DocSites.DATABASE_TOOLS,
                  url: '/docs/database-tools/mongorestore/mongorestore-compatibility-and-installation/',
                },
                {
                  label: 'Behavior',
                  contentSite: DocSites.DATABASE_TOOLS,
                  url: '/docs/database-tools/mongorestore/mongorestore-behavior-access-usage/',
                },
                {
                  label: 'Examples',
                  contentSite: DocSites.DATABASE_TOOLS,
                  url: '/docs/database-tools/mongorestore/mongorestore-examples/',
                },
              ],
            },
            {
              label: 'external link',
              contentSite: DocSites.DATABASE_TOOLS,
              url: 'https://www.mongodb.com/pricing',
            },
            {
              label: 'l1 link',
              contentSite: DocSites.CHARTS,
              url: '/docs/charts/',
            },
            {
              label: 'just a dif link',
              contentSite: DocSites.CLOUD_DOCS,
              url: '/docs/atlas/getting-started/meow',
            },
            {
              label: 'bsondump',
              contentSite: DocSites.DATABASE_TOOLS,
              url: '/docs/database-tools/bsondump/',
            },
          ],
        },
      ],
    },
    {
      label: 'ATLAS',
      url: '/docs/atlas/getting-started/',
      contentSite: DocSites.CLOUD_DOCS,
      items: [
        {
          label: 'Application Devlopement',
          group: true,
          versionDropdown: true,
          contentSite: DocSites.CLOUD_DOCS,
          items: [
            {
              label: 'Connect to Clusters',
              contentSite: DocSites.CLOUD_DOCS,
              url: '/docs/atlas/connect-to-database-deployment',
              collapsible: true,
              items: [
                {
                  label: 'Drivers',
                  contentSite: DocSites.CLOUD_DOCS,
                  url: '/docs/atlas/driver-connection',
                },
                {
                  label: 'Compass',
                  contentSite: DocSites.CLOUD_DOCS,
                  url: '/docs/atlas/compass-connection',
                },
                {
                  label: 'mongosh',
                  contentSite: DocSites.CLOUD_DOCS,
                  url: '/docs/atlas/mongo-shell-connection',
                },
                {
                  collapsible: true,
                  label: 'BI Connector',
                  contentSite: DocSites.CLOUD_DOCS,
                  url: '/docs/atlas/bi-connection',
                  items: [
                    {
                      label: 'Transition to Atlas SQL',
                      contentSite: DocSites.CLOUD_DOCS,
                      url: '/docs/atlas/tutorial/transition-bic-to-atlas-sql',
                    },
                    {
                      label: 'System DSN',
                      contentSite: DocSites.CLOUD_DOCS,
                      url: '/docs/atlas/tutorial/create-system-dsn',
                    },
                  ],
                },
              ],
            },
            {
              label: 'Command Line Tools',
              contentSite: DocSites.CLOUD_DOCS,
              url: '/docs/atlas/command-line-tools',
            },
            {
              label: 'VS Code',
              contentSite: DocSites.CLOUD_DOCS,
              url: '/docs/atlas/mongodb-for-vscode',
            },
          ],
        },
        {
          label: 'Atlas cli',
          group: true,
          versionDropdown: true,
          contentSite: DocSites.ATLAS_CLI,
          items: [
            {
              label: 'Connect',
              contentSite: DocSites.ATLAS_CLI,
              url: '/docs/atlas/cli/:version/connect-atlas-cli/',
              collapsible: true,
              items: [
                {
                  label: 'Save Connection Settings',
                  contentSite: DocSites.ATLAS_CLI,
                  url: '/docs/atlas/cli/:version/atlas-cli-save-connection-settings',
                },
                {
                  label: 'Migrate to the Atlas CLI',
                  contentSite: DocSites.ATLAS_CLI,
                  url: '/docs/atlas/cli/:version/migrate-to-atlas-cli/',
                },
                {
                  label: 'mongosh',
                  contentSite: DocSites.ATLAS_CLI,
                  url: '/docs/atlas/mongo-shell-connection',
                },
              ],
            },
            {
              label: 'Command ',
              contentSite: DocSites.ATLAS_CLI,
              url: '/docs/atlas/cli/:version/command/atlas/',
            },
          ],
        },
      ],
    },
    {
      label: 'C# Quick Start',
      url: '/docs/drivers/csharp/:version/quick-start',
      contentSite: DocSites.CSHARP,
      versionDropdown: true,
      items: [
        {
          label: 'C# Documentation',
          group: true,
          contentSite: DocSites.CHARTS,
          items: [
            {
              label: 'c2c sync',
              showSubNav: true,
              contentSite: DocSites.C2C,
              url: '/docs/cluster-to-cluster-sync/:version/about-mongosync/',
              items: [
                {
                  label: 'c2c documentation',
                  contentSite: DocSites.C2C,
                  group: true,
                  versionDropdown: true,
                  items: [
                    {
                      label: 'Installation',
                      contentSite: DocSites.C2C,
                      url: '/docs/cluster-to-cluster-sync/:version/installation/',
                    },
                    {
                      contentSite: DocSites.C2C,
                      label: 'Connect',
                      url: '/docs/cluster-to-cluster-sync/:version/connecting/',
                    },
                    {
                      label: 'Cluster Topologies',
                      contentSite: DocSites.C2C,
                      url: '/docs/cluster-to-cluster-sync/:version/topologies/',
                    },
                  ],
                },
              ],
            },
            {
              label: 'C# driver',
              showSubNav: true,
              url: '/docs/drivers/csharp/:version/whats-new/',
              contentSite: DocSites.CSHARP,
              items: [
                {
                  label: 'C# Documentation',
                  group: true,
                  contentSite: DocSites.CSHARP,
                  versionDropdown: true,
                  items: [
                    {
                      label: 'Quick Reference',
                      contentSite: DocSites.CSHARP,
                      url: '/docs/drivers/csharp/:version/quick-reference/',
                    },
                    {
                      label: 'Usage Examples',
                      contentSite: DocSites.CSHARP,
                      url: '/docs/drivers/csharp/:version/usage-examples',
                      collapsible: true,
                      items: [
                        {
                          label: 'Find a Document',
                          contentSite: DocSites.CSHARP,
                          url: '/docs/drivers/csharp/:version/usage-examples/findOne/',
                        },
                        {
                          label: 'Find Multiple Documents',
                          contentSite: DocSites.CSHARP,
                          url: '/docs/drivers/csharp/:version/usage-examples/findMany/',
                        },
                        {
                          label: 'Insert a Document',
                          contentSite: DocSites.CSHARP,
                          url: '/docs/drivers/csharp/:version/usage-examples/insertOne',
                        },
                      ],
                    },
                    {
                      label: "What's New",
                      contentSite: DocSites.CSHARP,
                      url: '/docs/drivers/csharp/:version/whats-new',
                    },
                  ],
                },
                {
                  label: 'Fundamentals',
                  group: true,
                  contentSite: DocSites.CSHARP,
                  items: [
                    {
                      label: 'Operations with Builders',
                      contentSite: DocSites.CSHARP,
                      url: '/docs/drivers/csharp/:version/fundamentals/builders',
                    },
                    {
                      label: 'Databases and Collections',
                      contentSite: DocSites.CSHARP,
                      url: '/docs/drivers/csharp/:version/fundamentals/database-collection',
                      collapsible: true,
                      items: [
                        {
                          label: 'Run a Database Command',
                          contentSite: DocSites.CSHARP,
                          url: '/docs/drivers/csharp/:version/fundamentals/databases-collections/run-command',
                        },
                      ],
                    },
                  ],
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
