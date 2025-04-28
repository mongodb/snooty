import type { TocItem } from '../src/components/UnifiedSidenav/UnifiedConstants';

export const tocData = (): TocItem[] => {
  const toc: TocItem[] = [
    {
      label: 'C# Quick Start',
      url: '/quick-start',
      glyph: 'Bulb',
      prefix: '/version/csharp/bianca.laube/DOP-5382',
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
          prefix: '/master/cloud-docs/bianca.laube/DOP-5382',
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
      prefix: '/master/cloud-docs/bianca.laube/DOP-5382',
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
          prefix: '/master/compass/bianca.laube/DOP-5382',
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
      prefix: '/master/cloud-docs/bianca.laube/DOP-5382',
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
