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
          items: [
            {
              label: 'tutorials',
              url: '/docs/charts/tutorials/',
              collapsible: true,
              items: [
                {
                  label: 'Visualizing Order Data',
                  url: '/docs/charts/tutorial/order-data/order-data-tutorial-overview/',
                },
                {
                  label: 'Visualizing Movie Details',
                  url: '/docs/charts/tutorial/movie-details/movie-details-tutorial-overview/',
                },
              ],
            },
            {
              label: 'Data transfer',
              url: '/docs/charts/admin-settings/',
            },
            {
              label: 'dashboards',
              url: '/docs/charts/dashboards/',
            },
          ],
        },
        {
          label: 'CHART TYPES',
          group: true,
          items: [
            {
              label: 'Natural Language Charts',
              url: '/docs/charts/chart-type-reference/natural-language-charts/',
            },
            {
              label: 'Line and Area Charts',
              url: '/docs/charts/chart-type-reference/line-area-chart/',
            },
            {
              label: 'Heatmap',
              url: '/docs/charts/chart-type-reference/heatmap/',
            },
          ],
        },
      ],
    },
    {
      label: 'Client Libraries',
      url: '/docs/cluster-to-cluster-sync/:version/quickstart',
      contentSite: DocSites.C2C,
      items: [
        {
          label: 'Client Libraries',
          group: true,
          items: [
            {
              label: 'c2c sync',
              showSubNav: true,
              url: '/docs/cluster-to-cluster-sync/:version/about-mongosync/',
              items: [
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
                      label: 'Operations with Builders',
                      url: '/docs/drivers/csharp/:version/fundamentals/builders',
                    },
                    {
                      label: 'Databases and Collections',
                      url: '/docs/drivers/csharp/:version/fundamentals/database-collection',
                      collapsible: true,
                      items: [
                        {
                          label: 'Run a Database Command',
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
