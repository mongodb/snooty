export const tocData = () => {
  const toc = {
    toc: [
      {
        prefix: '/drivers/csharp/version', // this will be item one
        label: 'C# Quick Start',
        url: '/quick-start',
        isTab: true,
        items: [
          {
            label: 'Overview',
            url: '/',
          },
          {
            label: 'Get Started',
            group: true,
            items: [
              {
                label: 'Quick Reference',
                url: '/quick-reference/',
              },
              {
                label: "What's new",
                url: '/whats-new/',
              },
              {
                label: 'FAQ',
                url: '/faq',
              },
            ],
          },
        ],
      },
      {
        prefix: '/csharp/version', // this will be item 2
        label: 'Fundamentals',
        url: '/fundamentals',
        isTab: true,
        items: [
          {
            label: 'Connection',
            group: true,
            items: [
              {
                label: 'Connection Guide',
                url: '/fundamentals/connection/connect/',
              },
              {
                label: 'Connection Options',
                url: '/fundamentals/connection/connection-options/',
              },
              {
                label: 'Network Compression',
                url: '/fundamentals/connection/network-compression/',
              },
            ],
          },
          {
            label: 'CRUD Operations',
            group: true,
            items: [
              {
                label: 'Operations with Builders',
                url: '/fundamentals/builders/',
              },
              {
                label: 'Write',
                url: '/fundamentals/crud/write-operations/',
                collapsible: true,
                items: [
                  {
                    label: 'Insert',
                    url: '/fundamentals/crud/write-operations/insert/',
                  },
                  {
                    label: 'Replace',
                    url: '/fundamentals/crud/write-operations/replace/',
                  },
                  {
                    label: 'Update Many',
                    url: '/fundamentals/crud/write-operations/update-many/',
                    collapsible: true,
                    items: [
                      {
                        label: 'Fields',
                        url: '/fundamentals/crud/write-operations/update-many/fields',
                      },
                      {
                        label: 'Arrays',
                        url: '/fundamentals/crud/write-operations/update-many/arrays',
                      },
                    ],
                  },
                ],
              },
              {
                label: 'Read',
                url: '/fundamentals/crud/read-operations/',
                collapsible: true,
                items: [
                  {
                    label: 'Retrieve Data',
                    url: '/fundamentals/crud/read-operations/retrieve/',
                  },
                  {
                    label: 'Specify Fields to Return',
                    url: '/fundamentals/crud/read-operations/project/',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        label: 'Examples', // this will be item 3
        url: '/usage-examples/',
        isTab: true,
        items: [
          {
            label: 'Updating Documents',
            group: true,
            items: [
              {
                label: 'Find a document',
                url: '/usage-examples/findOne/',
              },
              {
                label: 'Insert a Document',
                url: '/usage-examples/insertOne/',
              },
              {
                label: 'Update a document',
                url: '/usage-examples/updateOne/',
              },
              {
                label: 'Issues and Help',
                url: '/issues-and-help/',
              },
            ],
          },
        ],
      },
    ],
  };

  return toc;
};
