import React from 'react';
import Callout from '@leafygreen-ui/callout';

const HOST_WHITELIST = [
  'mongodb-mms-build-server.s3.amazonaws.com',
  'raw.githubusercontent.com',
  'mciuploads.s3.amazonaws.com',
];
export const isLinkInWhitelist = (link) => HOST_WHITELIST.includes(new URL(link).hostname);

export const WhitelistErrorCallout = (props) => {
  return (
    <Callout variant="warning" {...props}>
      The link you're trying to preview isn't currently permitted - if this is a mistake, please raise a pull request to
      add this source{' '}
      <a href="https://github.com/mongodb/snooty/blob/master/src/components/OpenAPI/whitelist.js#L4">here</a> for our
      consideration.
    </Callout>
  );
};
