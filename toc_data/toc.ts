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
          items: [
            {
              label: 'mongodump',
              url: '/docs/database-tools/mongodump/',
              collapsible: true,
              items: [
                {
                  label: 'Compatibility & Installation',
                  url: '/docs/database-tools/mongodump/mongodump-compatibility-and-installation/',
                },
                {
                  label: 'Behavior',
                  url: '/docs/database-tools/mongodump/mongodump-behavior/',
                },
                {
                  label: 'Examples',
                  url: '/docs/database-tools/mongodump/mongodump-examples/',
                },
              ],
            },
            {
              label: 'mongorestore',
              url: '/docs/database-tools/mongorestore/',
              collapsible: true,
              items: [
                {
                  label: 'Compatibility & Installation',
                  url: '/docs/database-tools/mongorestore/mongorestore-compatibility-and-installation/',
                },
                {
                  label: 'Behavior',
                  url: '/docs/database-tools/mongorestore/mongorestore-behavior-access-usage/',
                },
                {
                  label: 'Examples',
                  url: '/docs/database-tools/mongorestore/mongorestore-examples/',
                },
              ],
            },
            {
              label: 'external link',
              url: 'https://www.mongodb.com/pricing',
            },
            {
              label: 'l1 link',
              contentSite: DocSites.CLOUD_DOCS,
              url: '/docs/charts/',
            },
            {
              label: 'just a dif link',
              contentSite: DocSites.CLOUD_DOCS,
              url: '/docs/atlas/getting-started/meow',
            },
            {
              label: 'bsondump',
              url: '/docs/database-tools/bsondump/',
            },
          ],
        },
      ],
    },
    {
      label: 'Atlas',
      url: '/docs/charts/',
      contentSite: DocSites.CHARTS,
      items: [
        {
          label: 'ATLAS CHARTS',
          group: true,
          versionDropdown: true,
          items: [
            {
              label: 'tutorials',
              url: '/docs/charts/tutorials/',
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
                  label: 'c2c documentation',
                  group: true,
                  versionDropdown: true,
                  items: [
                    {
                      label: 'Installation',
                      url: '/docs/cluster-to-cluster-sync/:version/installation/',
                    },
                    {
                      label: 'Connect',
                      url: '/docs/cluster-to-cluster-sync/:version/connecting/',
                    },
                    {
                      label: 'Cluster Topologies',
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
                  versionDropdown: true,
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
              url: '/docs/atlas/cli/:version/connect-atlas-cli/',
              collapsible: true,
              items: [
                {
                  label: 'Save Connection Settings',
                  url: '/docs/atlas/cli/:version/atlas-cli-save-connection-settings',
                },
                {
                  label: 'Migrate to the Atlas CLI',
                  url: '/docs/atlas/cli/:version/migrate-to-atlas-cli/',
                },
                {
                  label: 'mongosh',
                  url: '/docs/atlas/mongo-shell-connection',
                },
              ],
            },
            {
              label: 'Command ',
              url: '/docs/atlas/cli/:version/command/atlas/',
            },
            {
              label: 'Automate',
              url: '/docs/atlas/cli/:version/atlas-cli-automate/',
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
          contentSite: '/docs/drivers/csharp/master/cloud-docs/bianca.laube/DOP-5371',
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
        {
          label: 'Atlas cli',
          group: true,
          versionDropdown: true,
          contentSite: DocSites.ATLAS_CLI,
          items: [
            {
              label: 'Connect',
              url: '/docs/atlas/cli/:version/connect-atlas-cli/',
              collapsible: true,
              items: [
                {
                  label: 'Save Connection Settings',
                  url: '/docs/atlas/cli/:version/atlas-cli-save-connection-settings',
                },
                {
                  label: 'Migrate to the Atlas CLI',
                  url: '/docs/atlas/cli/:version/migrate-to-atlas-cli/',
                },
                {
                  label: 'mongosh',
                  url: '/docs/atlas/mongo-shell-connection',
                },
              ],
            },
            {
              label: 'Command ',
              url: '/docs/atlas/cli/:version/command/atlas/',
            },
            {
              label: 'Automate',
              url: '/docs/atlas/cli/:version/atlas-cli-automate/',
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
          contentSite: '/docs/drivers/csharp/master/cloud-docs/bianca.laube/DOP-5371',
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
