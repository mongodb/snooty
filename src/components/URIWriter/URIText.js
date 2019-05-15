import PropTypes from 'prop-types';
import {
  TEMPLATE_TYPE_SELF_MANAGED,
  TEMPLATE_TYPE_REPLICA_SET,
  TEMPLATE_TYPE_ATLAS_36,
  TEMPLATE_TYPE_ATLAS_34,
  TEMPLATE_TYPE_ATLAS,
  URI_PLACEHOLDER,
  USERNAME_PLACEHOLDER,
  URISTRING_SHELL_PLACEHOLDER,
  URISTRING_SHELL_NOUSER_PLACEHOLDER,
} from './constants';

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
  if (Object.entries(uri).length === 0 && activeDeployment === TEMPLATE_TYPE_ATLAS) {
    template = TEMPLATE_TYPE_ATLAS_36;
  } else if (Object.entries(uri).length === 0 && activeDeployment === TEMPLATE_TYPE_SELF_MANAGED) {
    template = TEMPLATE_TYPE_SELF_MANAGED;
  } else if (uri.atlasVersion) {
    template = uri.atlasVersion;
  } else if (uri.localEnv) {
    template = uri.localEnv;
  }

  const username = uri.username || '$[username]';
  const authSource = uri.authSource || '$[authSource]';
  const database = uri.database || '$[database]';
  const replicaSet = uri.replicaSet || '$[replicaSet]';
  const options = optionStringifier(TEMPLATE_OPTIONS[template], uri);
  const hostlist = uri.hostlist && uri.hostlist.length > 0 ? uri.hostlist : '$[hostlist]';

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
      template: `mongodb://${username}:$[password]@${hostlist}/${database}?retryWrites=true`,
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
    atlasVersion: PropTypes.string,
    authSource: PropTypes.string,
    database: PropTypes.string,
    localEnv: PropTypes.string,
    hostlist: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
    replicaSet: PropTypes.string,
    username: PropTypes.string,
  }).isRequired,
  value: PropTypes.string.isRequired,
};

URIText.defaultProps = {
  activeDeployment: TEMPLATE_TYPE_ATLAS,
};

export default URIText;
