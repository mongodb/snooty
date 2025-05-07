import type { TocItem } from '../src/components/UnifiedSidenav/UnifiedConstants';

// each url has to be unique with the prefix!!!!
export const tocData = (): TocItem[] => {
  const toc: TocItem[] = [
    {
      label: 'C# Quick Start',
      url: '/quick-start',
      glyph: 'Bulb',
      prefix: '/${version}/csharp/bianca.laube/DOP-5371',
      items: [
        {
          label: 'C# Documentation',
          group: true,
          items: [
            {
              label: 'Quick Reference',
              url: '/quick-reference/',
            },
            {
              label: 'Usage Examples',
              url: '/usage-examples',
              collapsible: true,
              items: [
                {
                  label: 'Find a Document',
                  url: '/usage-examples/findOne/',
                },
                {
                  label: 'Find Multiple Documents',
                  url: '/usage-examples/findMany/',
                },
                {
                  label: 'Insert a Document',
                  url: '/usage-examples/insertOne',
                },
              ],
            },
            {
              label: "What's New",
              url: '/whats-new',
            },
          ],
        },
        {
          label: 'Fundamentals',
          group: true,
          items: [
            {
              label: 'Operations with Builders',
              url: '/fundamentals/builders',
            },
            {
              label: 'Databases and Collections',
              url: '/fundamentals/database-collection',
              collapsible: true,
              items: [
                {
                  label: 'Run a Database Command',
                  url: '/fundamentals/databases-collections/run-command',
                },
              ],
            },
          ],
        },
        {
          label: 'Connect to cloud',
          group: true,
          prefix: '/master/cloud-docs/bianca.laube/DOP-5371',
          items: [
            {
              label: 'Manage Clusters',
              url: '/manage-database-deployments',
              collapsible: true,
              items: [
                {
                  label: 'Storage',
                  url: '/customize-storage',
                },
                {
                  label: 'Auto-Scaling',
                  url: '/cluster-autoscaling',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      label: 'Get Started',
      url: '/getting-started',
      glyph: 'LightningBolt',
      prefix: '/master/cloud-docs/bianca.laube/DOP-5371',
      items: [
        {
          label: 'Get Started',
          group: true,
          items: [
            {
              label: 'Create Account',
              url: '/tutorial/create-atlas-account',
            },
            {
              label: 'Deploy a Free Cluster',
              url: '/tutorial/deploy-free-tier-cluster',
            },
            {
              label: 'Manage Database Users',
              url: '/tutorial/manage-users',
            },
            {
              label: 'Manage the IP Access List',
              url: '/tutorial/access-list',
            },
            {
              label: 'Connect to the Cluster',
              url: '/tutorial/connect-to-the-cluster',
            },
            {
              label: 'Insert and View a Document',
              url: '/tutorial/insert-and-view',
            },
            {
              label: 'Load Sample Data',
              url: '/tutorial/load-data',
            },
            {
              label: 'Generate Synthetic Data',
              url: '/tutorial/generate-data',
            },
            {
              label: 'Atlas cli',
              url: '/cli/v1.32',
            },
          ],
        },
        {
          label: 'Docs Compass',
          prefix: '/master/compass/bianca.laube/DOP-5371',
          group: true,
          items: [
            {
              label: 'Overview',
              url: '/new',
            },
            {
              label: 'Import and export',
              url: '/import-export',
            },
          ],
        },
      ],
    },
    {
      label: 'Application Development',
      url: '/create-connect-deployments',
      glyph: 'Code',
      prefix: '/master/cloud-docs/bianca.laube/DOP-5371',
      items: [
        {
          label: 'Application Development',
          group: true,
          items: [
            {
              label: 'Connect to Clusters',
              url: '/connect-to-database-deployment',
              collapsible: true,
              items: [
                {
                  label: 'Drivers',
                  url: '/driver-connection',
                },
                {
                  label: 'Compass',
                  url: '/compass-connection',
                },
                {
                  label: 'mongosh',
                  url: '/mongo-shell-connection',
                },
                {
                  collapsible: true,
                  label: 'BI Connector',
                  url: '/bi-connection',
                  items: [
                    {
                      label: 'Transition to Atlas SQL',
                      url: '/tutorial/transition-bic-to-atlas-sql',
                    },
                    {
                      label: 'System DSN',
                      url: '/tutorial/create-system-dsn',
                    },
                  ],
                },
              ],
            },
            {
              label: 'Command Line Tools',
              url: '/command-line-tools',
            },
            {
              label: 'VS Code',
              url: '/mongodb-for-vscode',
            },
          ],
        },
        {
          label: 'Security',
          group: true,
          items: [
            {
              label: 'Authentication',
              url: '/authentication',
            },
            {
              label: 'Auditing',
              url: '/auditing',
            },
            {
              label: 'Encryption',
              url: '/encryption',
            },
            {
              label: 'Support Access',
              url: '/support-acces',
            },
          ],
        },
      ],
    },
    {
      label: 'Client Libraries and APIs',
      url: '/builders',
      prefix: '/master/java/bianca.laube/DOP-5371',
      items: [
        {
          label: 'Client Libraries',
          group: true,
          items: [
            {
              label: 'Java Driver',
              url: '/get-started/',
              prefix: '/master/java/bianca.laube/DOP-5371',
              showSubNav: true,
              items: [
                {
                  label: 'Node js driver',
                  group: true,
                  items: [
                    {
                      label: 'Connection Guide',
                      collapsible: true,
                      url: '/connection',
                      items: [
                        {
                          label: 'Create Mongodb client',
                          url: '/connection/mongoclient',
                        },
                        {
                          label: 'Connection Troubleshooting',
                          url: '/connection/connection-troubleshooting',
                        },
                      ],
                    },
                    {
                      collapsible: true,
                      label: 'CRUD Operator',
                      url: '/crud',
                      items: [
                        {
                          label: 'Insert Operations',
                          url: '/crud/insert',
                        },
                        {
                          label: 'Update Documents',
                          url: '/crud/update-documents/',
                          collapsible: true,
                          items: [
                            {
                              label: 'Update Arrays',
                              url: '/crud/update-documents/embedded-arrays',
                            },
                            {
                              label: 'Upsert',
                              url: '/crud/update-documents/upsert/',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              label: 'C driver',
              showSubNav: true,
              prefix: '/master/c/bianca.laube/DOP-5371',
              url: '/async-c-driver',
              items: [
                {
                  label: 'C Driver',
                  group: true,
                  items: [
                    {
                      label: 'Data Aggregation',
                      url: '/aggregation',
                    },
                    {
                      label: 'Databases and Connections',
                      url: '/databases-collections',
                      collapsible: true,
                      items: [
                        {
                          label: 'Time series Data',
                          url: '/databases-collections/time-series',
                        },
                        {
                          label: 'Run a Database Command',
                          url: '/databases-collections/run-command',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'APIs',
          group: true,
          items: [
            {
              label: 'Atlas Search',
              prefix: '/master/java/bianca.laube/DOP-5371',
              url: '/atlas-search',
            },
          ],
        },
      ],
    },
  ];

  return toc;
};
