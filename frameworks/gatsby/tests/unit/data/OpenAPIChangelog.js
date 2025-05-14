export const mockChangelog = [
  {
    date: '2024-02-01',
    paths: [
      {
        path: '/api/atlas/v2/groups/{groupId}/alertConfigs/{alertConfigId}',
        httpMethod: 'PUT',
        operationId: 'updateAlertConfiguration',
        tag: 'Alert Configurations',
        versions: [
          {
            version: '2023-01-01',
            stabilityLevel: 'stable',
            changeType: 'removed',
            changes: [
              {
                change: 'resource version 2023-01-01 was removed, latest available resource version is 2023-02-01',
                changeCode: 'resource-version-removed',
                backwardCompatible: true,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    date: '2024-02-01',
    paths: [
      {
        path: '/api/atlas/v2/groups/{groupId}/alertConfigs/{alertConfigId}',
        httpMethod: 'PUT',
        operationId: 'updateAlertConfiguration',
        tag: 'Alert Configurations',
        versions: [
          {
            version: '2023-01-01',
            stabilityLevel: 'stable',
            changeType: 'removed',
            changes: [
              {
                change: 'This change should really definitely be hidden',
                changeCode: 'resource-version-removed',
                backwardCompatible: true,
                hideFromChangelog: true,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    date: '2023-02-01',
    paths: [
      {
        path: '/api/atlas/v2/groups/byName/{groupName}',
        httpMethod: 'GET',
        operationId: 'getProjectByName',
        tag: 'Projects',
        versions: [
          {
            version: '2023-02-01',
            stabilityLevel: 'stable',
            changeType: 'release',
            changes: [
              {
                change: 'resource version added.',
                changeCode: 'resource-version-added',
                backwardCompatible: false,
                hideFromChangelog: false,
              },
            ],
          },
        ],
      },
      {
        path: '/api/atlas/v2/groups/{groupId}/alertConfigs/{alertConfigId}',
        httpMethod: 'PUT',
        operationId: 'updateAlertConfiguration',
        tag: 'Alert Configurations',
        versions: [
          {
            version: '2023-02-01',
            stabilityLevel: 'stable',
            changeType: 'release',
            changes: [
              {
                change: 'This change should be hidden',
                changeCode: 'resource-version-added',
                backwardCompatible: false,
                hideFromChangelog: true,
              },
              {
                change: 'resource version added.',
                changeCode: 'resource-version-added',
                backwardCompatible: false,
              },
              {
                change:
                  "for the 'query' request parameter 'clusterName', default value was changed from 'default' to 'cluster0'",
                changeCode: 'request-parameter-default-value-changed',
                backwardCompatible: false,
              },
              {
                change: "added the optional property 'links' in the response with the '200' status.",
                changeCode: 'response-optional-property-added',
                backwardCompatible: true,
              },
            ],
          },
          {
            version: '2023-01-01',
            stabilityLevel: 'stable',
            changeType: 'deprecate',
            sunsetDate: '2024-02-01',
            changes: [
              {
                change: 'deprecated by resource version 2023-02-01 and marked for removal for 2024-02-01.',
                changeCode: 'resource-version-deprecated',
                backwardCompatible: false,
              },
            ],
          },
        ],
      },
      {
        path: '/api/atlas/v2/groups/{groupId}/accessList',
        httpMethod: 'POST',
        operationId: 'createProjectIpAccessList',
        tag: 'Project IP Access List',
        versions: [
          {
            version: '2023-01-01',
            stabilityLevel: 'stable',
            changeType: 'update',
            changes: [
              {
                change: "added the optional property 'name' in the response with the '200' status.",
                changeCode: 'response-optional-property-added',
                backwardCompatible: true,
              },
              {
                change: "added the optional property 'comment' in the response with the '200' status.",
                changeCode: 'response-optional-property-added',
                backwardCompatible: true,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    date: '2023-02-22',
    paths: [
      {
        path: '/api/atlas/v2/groups/byName/{groupName}',
        httpMethod: 'GET',
        operationId: 'getProjectByName',
        tag: 'Projects',
        versions: [
          {
            version: '2023-02-01',
            stabilityLevel: 'stable',
            changeType: 'update',
            changes: [
              {
                change:
                  "added the optional property 'withDefaultAlertsSettings' in the response with the '200' status.",
                changeCode: 'response-optional-property-added',
                backwardCompatible: true,
              },
            ],
          },
        ],
      },
    ],
  },
];

export const mockDiff = [
  {
    path: '/api/atlas/v2/federationSettings/{federationSettingsId}/connectedOrgConfigs',
    httpMethod: 'GET',
    operationId: 'listConnectedOrgConfigs',
    tag: 'Federated Authentication',
    changeType: 'update',
    changes: [
      {
        change: "a change",
        changeCode: 'response-non-success-status-removed',
        backwardCompatible: false,
        hideFromChangelog: true,
      },
      {
        change: "removed the non-success response with the status '400'.",
        changeCode: 'response-non-success-status-removed',
        backwardCompatible: false,
      },
      {
        change: "added the new optional 'query' request parameter 'envelope'.",
        changeCode: 'new-optional-request-parameter',
        backwardCompatible: true,
      },
      {
        change: 'this change should be hidden!',
        changeCode: 'operation-id-changed',
        backwardCompatible: true,
      },
      {
        change: 'this change should be hidden!',
        changeCode: 'operation-tag-changed',
        backwardCompatible: false,
        hideFromChangelog: false,
      },
    ],
  },
  {
    path: '/api/atlas/v2/groups/{groupId}/accessList',
    httpMethod: 'POST',
    operationId: 'createProjectIpAccessList',
    tag: 'Project IP Access List',
    changeType: 'removed',
    changes: [
      {
        change: "removed the required property 'name' from the response with the '200' status.",
        changeCode: 'response-required-property-removed',
        backwardCompatible: false,
        hideFromChangelog: true,
      },
      {
        change: "removed the required property 'name' from the response with the '200' status.",
        changeCode: 'response-required-property-removed',
        backwardCompatible: false,
      },
    ],
  },
];

export const mockChangelogMetadata = {
  runDate: '2023-04-03',
  specRevision: '422ab47f864909549362a7b39688404c82e2540b',
  specRevisionShort: '422ab47f864',
  versions: ['2023-01-01', '2023-02-01', '2023-08-11~preview'],
};
