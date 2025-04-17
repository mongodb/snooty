interface TocItem {
  label: string;
  glyph?: string;
  url?: string;
  group?: boolean;
  prefix?: string;
  collapsible?: boolean;
  items?: TocItem[];
}

const DOCS = 'docs'
const ATLAS_PREFIX = 'atlas';

export const tocData = (): TocItem[] => {
  const toc: TocItem[] = [
    {
      label: "(Won't work) C# Quick Start",
      url: '/c-sharp',
      glyph: 'Bulb',
      prefix: '/drivers/c-sharp',
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
          prefix: '/master/cloud-docs/bianca.laube/DOP-5343',
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
      items: [
        {
          label: 'Get Started',
          group: true,
          prefix: "/docs/atlas",
          items: [
            {
              label: 'Create Account',
              url: `/${DOCS}/${ATLAS_PREFIX}/tutorial/create-atlas-account/`,
            },
            {
              label: 'Deploy a Free Cluster',
              prefix: "/docs/atlas",
              url: '/docs/atlas/tutorial/deploy-free-tier-cluster/',
            },
            {
              label: 'Manage Database Users',
              prefix: "/docs/atlas",
              url: '/docs/relational-migrator/tutorial/create-mongodb-user-for-cluster/',
            },
            {
              label: "(Won't work) Manage the IP Access List",
              url: '/tutorial/access-list/',
            },
            {
              label: 'Connect to the Cluster',
              prefix: "/docs/atlas",
              url: '/tutorial/connect-to-your-cluster/',
            },
            {
              label: "(Won't work) Insert and View a Document",
              url: '/tutorial/insert-and-view',
            },
            {
              label: "(Won't work) Load Sample Data",
              url: '/tutorial/load-data',
            },
            {
              label: "(Won't work) Generate Synthetic Data",
              url: '/tutorial/generate-data',
            }
          ],
        },
        {
          label: "(Won't work) Docs Compass",
          prefix: '/master/compass/bianca.laube/DOP-5343',
          group: true,
          items: [
            {
              label: 'Overview',
              url: '/',
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
      prefix: '/master/cloud-docs/bianca.laube/DOP-5343',
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
  ];

  return toc;
};
