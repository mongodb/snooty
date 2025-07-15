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
            // {
            //   label: 'l1 link',
            //   contentSite: DocSites.CHARTS,
            //   url: '/docs/charts/',
            // },
            {
              label: 'just a dif link',
              contentSite: DocSites.CLOUD_DOCS,
              url: '/docs/atlas/getting-started/meow',
            },
            // {
            //   label: 'bsondump',
            //   contentSite: DocSites.DATABASE_TOOLS,
            //   url: '/docs/database-tools/bsondump/',
            // },
          ],
        },
      ],
    },
    {
      label: 'testing',
      url: '/docs/database-tools/bsondump/',
      contentSite: DocSites.DATABASE_TOOLS,
      items: [
        {
          label: 'ATLAS CHARTS',
          group: true,
          contentSite: DocSites.CHARTS,
          items: [
            {
              label: 'tutorials',
              url: '/docs/charts/tutorials/',
              contentSite: DocSites.CHARTS,
              collapsible: true,
              items: [
                {
                  label: 'Visualizing Order Data',
                  contentSite: DocSites.CHARTS,
                  url: '/docs/charts/tutorial/order-data/order-data-tutorial-overview/',
                },
                {
                  label: 'Visualizing Movie Details',
                  contentSite: DocSites.CHARTS,
                  url: '/docs/charts/tutorial/movie-details/movie-details-tutorial-overview/',
                },
              ],
            },
            {
              label: 'Data transfer',
              contentSite: DocSites.CHARTS,
              url: '/docs/charts/admin-settings/',
            },
            {
              label: 'dashboards',
              contentSite: DocSites.CHARTS,
              url: '/docs/charts/dashboards/',
            },
          ],
        },
        {
          label: 'CHART TYPES',
          group: true,
          contentSite: DocSites.CHARTS,
          items: [
            {
              label: 'Natural Language Charts',
              contentSite: DocSites.CHARTS,
              url: '/docs/charts/chart-type-reference/natural-language-charts/',
            },
            {
              label: 'Line and Area Charts',
              contentSite: DocSites.CHARTS,
              url: '/docs/charts/chart-type-reference/line-area-chart/',
            },
            {
              label: 'Heatmap',
              contentSite: DocSites.CHARTS,
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
