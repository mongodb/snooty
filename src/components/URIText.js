import PropTypes from 'prop-types';
import {
  TEMPLATE_TYPE_SELF_MANAGED,
  TEMPLATE_TYPE_REPLICA_SET,
  TEMPLATE_TYPE_ATLAS_36,
  TEMPLATE_TYPE_ATLAS_34,
  TEMPLATE_TYPE_ATLAS,
} from './URIWriter';

export const URI_PLACEHOLDER = '<URISTRING>';
export const USERNAME_PLACEHOLDER = '<USERNAME>';
export const URISTRING_SHELL_PLACEHOLDER = '<URISTRING_SHELL>';
export const URISTRING_SHELL_NOUSER_PLACEHOLDER = '<URISTRING_SHELL_NOUSER>';

const TEMPLATE_OPTIONS = {
  [TEMPLATE_TYPE_SELF_MANAGED]: [
    {
      name: 'authSource',
      type: 'text',
    },
  ],
  [TEMPLATE_TYPE_REPLICA_SET]: [
    {
      name: 'replicaSet',
      type: 'text',
    },
    {
      name: 'authSource',
      type: 'text',
    },
    {
      name: 'ssl',
      type: 'pass-through',
      value: 'true',
    },
  ],
  [TEMPLATE_TYPE_ATLAS_36]: [],
  [TEMPLATE_TYPE_ATLAS_34]: [
    {
      name: 'replicaSet',
      type: 'text',
    },
    {
      name: 'authSource',
      type: 'text',
    },
    {
      name: 'ssl',
      type: 'pass-through',
      value: 'true',
    },
  ],
};

function optionStringifier(options, uri) {
  const paramJoinCharacter = '&';
  const optionParams = [];
  options.forEach(({ name, type, value }) => {
    let paramValue = uri[name];
    if (!paramValue) {
      paramValue = type === 'pass-through' ? value : uri[name] || `$[${name}]`;
    }
    optionParams.push(`${name}=${paramValue}`);
  });
  return optionParams.join(paramJoinCharacter);
}

function generateURI(uri, activeDeployment, templateType) {
  let template = activeDeployment;
  if (uri.env) {
    template = uri.env;
  }

  if (activeDeployment === TEMPLATE_TYPE_ATLAS) {
    template = TEMPLATE_TYPE_ATLAS_36;
  }

  const username = uri.username || '$[username]';
  const authSource = uri.authSource || '$[authSource]';
  const database = uri.database || '$[database]';
  const replicaSet = uri.replicaSet || '$[replicaSet]';
  const options = optionStringifier(TEMPLATE_OPTIONS[template], uri);
  let hostlist = '$[hostlist]';
  if (uri.hostlist && Object.values(uri.hostlist).length > 0 && !Object.values(uri.hostlist).every(e => e === '')) {
    hostlist = Object.values(uri.hostlist);
    hostlist = hostlist.filter(host => host !== '');
  }

  const TEMPLATES = {
    [TEMPLATE_TYPE_SELF_MANAGED]: {
      template: `mongodb://${username}:$[password]@${hostlist}/${database}?${options}`,
      templatePasswordRedactedShell: `mongodb://${hostlist}/${database}?${options} --username ${username}`,
      templateShell: `mongodb://${username}:$[password]@${hostlist}/${database}?${options}`,
    },
    [TEMPLATE_TYPE_REPLICA_SET]: {
      template: `mongodb://${username}:$[password]@${hostlist}/${database}?${options}`,
      templatePasswordRedactedShell: `mongodb://${hostlist}/${database}?${options} --username ${username} --password`,
      templateShell: `mongodb://${username}:$[password]@${hostlist}/${database}?${options}`,
    },
    [TEMPLATE_TYPE_ATLAS_36]: {
      template: `mongodb+srv://${username}:$[password]@${hostlist}/${database}?retryWrites=true`,
      templatePasswordRedactedShell: `mongodb+srv://${hostlist}/${database} --username ${username} --password`,
      templateShell: `mongodb+srv://${username}:$[password]@${hostlist}/${database}`,
    },
    [TEMPLATE_TYPE_ATLAS_34]: {
      template: `mongodb://${username}:$[password]@${hostlist}/${database}?${options}`,
      templatePasswordRedactedShell: `mongodb://${hostlist}/${database}?replicaSet=${replicaSet} --ssl --authenticationDatabase ${authSource} --username ${username} --password`,
      templateShell: `mongodb://${hostlist}/${database}?replicaSet=${replicaSet} --ssl --authenticationDatabase ${authSource} --username ${username} --password $[password]`,
    },
  };

  return TEMPLATES[template][templateType];
}

function replacePlaceholderWithURI(value, activeDeployment, uri) {
  return value
    .replace(URI_PLACEHOLDER, generateURI(uri, activeDeployment, 'template'))
    .replace(USERNAME_PLACEHOLDER, uri.username || '$[username]')
    .replace(URISTRING_SHELL_PLACEHOLDER, generateURI(uri, activeDeployment, 'templateShell'))
    .replace(URISTRING_SHELL_NOUSER_PLACEHOLDER, generateURI(uri, activeDeployment, 'templatePasswordRedactedShell'));
}

function URIText({ value, activeDeployment, uri }) {
  return replacePlaceholderWithURI(value, activeDeployment, uri);
}

URIText.propTypes = {
  activeDeployment: PropTypes.string,
  uri: PropTypes.shape({
    atlas: PropTypes.string,
    authSource: PropTypes.string,
    database: PropTypes.string,
    env: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    hostlist: PropTypes.objectOf(PropTypes.string),
    replicaSet: PropTypes.string,
    username: PropTypes.string,
  }).isRequired,
  value: PropTypes.string.isRequired,
};

URIText.defaultProps = {
  activeDeployment: TEMPLATE_TYPE_ATLAS,
};

export default URIText;
