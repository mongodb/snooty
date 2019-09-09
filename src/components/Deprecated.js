import React from 'react';
import VersionModified from './VersionModified';

const Deprecated = props => <VersionModified {...props} introText="Deprecated since version" />;

export default Deprecated;
