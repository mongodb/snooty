export const mockDiff = [
  {
    path: '/api/atlas/v2/federationSettings/{federationSettingsId}/connectedOrgConfigs',
    httpMethod: 'GET',
    operationId: 'listConnectedOrgConfigs',
    tag: 'Federated Authentication',
    changeType: 'update',
    changes: [
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
      },
    ],
  },
];
