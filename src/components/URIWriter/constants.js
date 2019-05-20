import { DEPLOYMENTS } from '../../constants';

export const TEMPLATE_TYPE_SELF_MANAGED = DEPLOYMENTS[1];
export const TEMPLATE_TYPE_REPLICA_SET = 'local MongoDB with replica set';
export const TEMPLATE_TYPE_ATLAS_36 = 'Atlas (Cloud) v. 3.6';
export const TEMPLATE_TYPE_ATLAS_34 = 'Atlas (Cloud) v. 3.4';
export const TEMPLATE_TYPE_ATLAS = DEPLOYMENTS[0];

export const URI_PLACEHOLDER = '<URISTRING>';
export const USERNAME_PLACEHOLDER = '<USERNAME>';
export const URISTRING_SHELL_PLACEHOLDER = '<URISTRING_SHELL>';
export const URISTRING_SHELL_NOUSER_PLACEHOLDER = '<URISTRING_SHELL_NOUSER>';
