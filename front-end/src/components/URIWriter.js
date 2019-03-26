import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DEPLOYMENTS } from '../constants';
import { getLocalValue } from '../localStorage';

export const TEMPLATE_TYPE_SELF_MANAGED = DEPLOYMENTS[1];
export const TEMPLATE_TYPE_REPLICA_SET = 'local MongoDB with replica set';
export const TEMPLATE_TYPE_ATLAS_36 = 'Atlas (Cloud) v. 3.6';
export const TEMPLATE_TYPE_ATLAS_34 = 'Atlas (Cloud) v. 3.4';
export const TEMPLATE_TYPE_ATLAS = DEPLOYMENTS[0];

const LOCAL_ENVS = [
  {
    key: TEMPLATE_TYPE_SELF_MANAGED,
    value: 'Local MongoDB',
  },
  {
    key: TEMPLATE_TYPE_REPLICA_SET,
    value: 'Local MongoDB with Replica Set',
  },
];

const getDefaultEnvConfig = activeDeployment => {
  return activeDeployment === TEMPLATE_TYPE_ATLAS ? TEMPLATE_TYPE_ATLAS : TEMPLATE_TYPE_SELF_MANAGED;
};

export default class URIWriter extends Component {
  constructor(props) {
    super(props);

    const {
      activeTabs: { cloud },
    } = this.props;

    const emptyURI = {
      atlas: '',
      authSource: '',
      database: '',
      envConfig: getDefaultEnvConfig(cloud),
      hostlist: {
        host0: '',
      },
      prevPropsActiveDeployment: cloud,
      replicaSet: '',
      username: '',
    };

    this.state = { ...emptyURI, ...getLocalValue('uri') };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.hostlistCounter = 1;
  }

  static getDerivedStateFromProps(props, state) {
    const activeDeployment = props.activeTabs.cloud;
    if (activeDeployment !== state.prevPropsActiveDeployment) {
      return {
        envConfig: getDefaultEnvConfig(activeDeployment),
        prevPropsActiveDeployment: activeDeployment,
      };
    }
    return null;
  }

  hostnameHasError = host => {
    if (host === '') {
      return '';
    }

    const parsed = /^\s*([^:\s]+)(?::(\d+))?\s*$/.exec(host);
    if (!parsed) {
      return 'Invalid host format: must match the format "hostname:port"';
    }

    const port = parseInt(parsed[2], 10);
    if (Number.isNaN(port)) {
      return 'Missing port: host must match the format "hostname:port"';
    }

    if (port > 65535) {
      return 'Port number is too large';
    }

    return '';
  };

  atlasFormHasError = atlasString => {
    if (atlasString === '') {
      return '';
    }

    const re3dot4 = /(\S+):\/\/(\S+):(\S*)@(\S+)\/(\S+)\?(\S+)/;
    if (atlasString.match(re3dot4)) {
      return '';
    }

    const re3dot6 = /(\S+):\/\/(\S+):(\S*)@(\S+)\/([^\s?]+)\?/;
    if (atlasString.match(re3dot6)) {
      return '';
    }

    if (atlasString.indexOf(' --') > -1) {
      return '';
    }

    return 'Connection string could not be parsed';
  };

  parseURIParams = shellString => {
    const params = {};
    shellString.split('&').forEach(param => {
      const [key, value] = param.split('=');
      if (key !== 'password') {
        params[key] = value;
      }
    });
    return params;
  };

  parseOutEnvAndClusters(splitOnSpaceClusterEnv, callback) {
    // depending on whether this is 3.6 or 3.4 the cluster info looks slightly different
    // 3.4 uses the URI to pass in a replica set name
    let shellMatch = /(\w+):\/\/((\S+)(:)+(\S+))\/(\w+)?\?(\S+)/;
    const shellMatch36 = /((\w+)\+(\w+)):\/\/((\S+))\/(\w+)/;
    if (splitOnSpaceClusterEnv.startsWith('mongodb+srv')) {
      shellMatch = shellMatch36;
    }
    const shellArray = splitOnSpaceClusterEnv.match(shellMatch);
    if (shellArray[1] === 'mongodb') {
      const hostlist = {};
      const hostListString = shellArray[2];
      hostListString.split(',').forEach((host, index) => {
        hostlist[`host${index}`] = host;
      });
      this.setState(
        {
          envConfig: TEMPLATE_TYPE_ATLAS_34,
          database: shellArray[6],
          hostlist,
          ...this.parseURIParams(shellArray[7]),
        },
        () => callback(this.state)
      );
    } else {
      const hostlist = { host0: shellArray[4] };
      this.setState(
        {
          envConfig: TEMPLATE_TYPE_ATLAS_36,
          database: shellArray[6],
          hostlist,
        },
        () => callback(this.state)
      );
    }
  }

  parseOutShellParams(splitOnSpace, callback) {
    const params = {};
    for (let i = 0; i < splitOnSpace.length; i += 1) {
      if (splitOnSpace[i].startsWith('--')) {
        if (!splitOnSpace[i + 1].startsWith('--')) {
          let splitKey = splitOnSpace[i].replace('--', '');
          let splitValue = splitOnSpace[i + 1];

          if (splitKey === 'authenticationDatabase') {
            splitKey = 'authSource';
          }

          // sometimes the next string is another parameter,
          // ignore those as they are canned
          if (!splitValue.startsWith('--')) {
            splitValue = splitValue.replace('<', '').replace('>', '');

            if (splitKey !== 'password') {
              params[splitKey] = splitValue;
            }
          }
        }
      }
    }
    this.setState(
      prevState => ({
        ...prevState,
        ...params,
      }),
      () => callback(this.state)
    );
  }

  parseTo3dot4(atlasString, callback) {
    const re = /(\S+):\/\/(\S+):(\S*)@(\S+)\/(\S+)\?(\S+)/;
    const matchesArray = atlasString.match(re);
    if (!matchesArray) {
      this.clearURI(callback);
      return;
    }

    const hostlist = {};
    matchesArray[4].split(',').forEach((host, index) => {
      hostlist[`host${index}`] = host;
    });
    this.setState(
      {
        envConfig: TEMPLATE_TYPE_ATLAS_34,
        username: matchesArray[2],
        hostlist,
        database: matchesArray[5],
        ...this.parseURIParams(matchesArray[6]),
      },
      () => callback(this.state)
    );
  }

  parseTo3dot6(atlasString, callback) {
    const re = /(\S+):\/\/(\S+):(\S*)@(\S+)\/([^\s?]+)\?/;
    const matchesArray = atlasString.match(re);
    if (!matchesArray) {
      this.clearURI(callback);
      return;
    }

    const hostlist = { host0: matchesArray[4] };
    this.setState(
      {
        envConfig: TEMPLATE_TYPE_ATLAS_36,
        username: matchesArray[2],
        hostlist,
        database: matchesArray[5],
      },
      () => callback(this.state)
    );
  }

  parseShell(atlasString, callback) {
    const splitOnSpace = atlasString.split(' ');
    let splitOnSpaceClusterEnv = splitOnSpace[1];
    splitOnSpaceClusterEnv = splitOnSpaceClusterEnv.replace(/"/g, '');
    this.parseOutShellParams(splitOnSpace, callback);
    this.parseOutEnvAndClusters(splitOnSpaceClusterEnv, callback);

    return true;
  }

  parseAtlasString(target, pastedValue, callback) {
    const atlasString = pastedValue.replace(/[\n\r]+/g, '').trim();
    const error = target.setCustomValidity(this.atlasFormHasError(atlasString));

    if (!error) {
      this.clearURI();
    }

    if (atlasString.indexOf(' --') > -1) {
      return this.parseShell(atlasString, callback);
    }

    if (atlasString.startsWith('mongodb+srv')) {
      return this.parseTo3dot6(atlasString, callback);
    }
    return this.parseTo3dot4(atlasString, callback);
  }

  clearURI(callback) {
    const {
      activeTabs: { cloud },
    } = this.props;
    this.setState(
      {
        authSource: '',
        database: '',
        envConfig: getDefaultEnvConfig(cloud),
        hostlist: {
          host0: '',
        },
        prevPropsActiveDeployment: cloud,
        replicaSet: '',
        ssl: '',
        username: '',
      },
      () => typeof callback === 'function' && callback(this.state)
    );
  }

  handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    const { handleUpdateURIWriter } = this.props;

    event.preventDefault();

    if (name === 'atlas') {
      this.setState({ [name]: value }, () => this.parseAtlasString(target, value, handleUpdateURIWriter));
    } else if (name.includes('host')) {
      target.setCustomValidity(this.hostnameHasError(value));
      this.updateHostlist(name, value, handleUpdateURIWriter);
    } else {
      this.setState({ [name]: value }, () => handleUpdateURIWriter(this.state));
    }
  }

  handleLocalEnvChange(envConfig) {
    const { handleUpdateURIWriter } = this.props;

    this.setState({ envConfig }, () => handleUpdateURIWriter(this.state));
  }

  updateHostlist(name, value, callback) {
    const { hostlist } = this.state;
    if (value === '' && Object.keys(hostlist).length > 1) {
      this.setState(
        prevState => {
          const deletedState = Object.assign({}, prevState.hostlist);
          delete deletedState[name];
          return { hostlist: deletedState };
        },
        () => {
          if (!this.hostnameHasError(value)) {
            callback(this.state);
          }
        }
      );
    } else {
      this.setState(
        prevState => ({
          hostlist: {
            ...prevState.hostlist,
            [name]: value,
          },
        }),
        () => {
          if (this.hostnameHasError(value) === '') {
            callback(this.state);
          }
          // eslint-disable-next-line react/destructuring-assignment
          if (!Object.values(this.state.hostlist).includes('')) {
            const newKeyName = `host${this.hostlistCounter++}`; // eslint-disable-line no-plusplus
            this.setState(prevState => ({
              hostlist: {
                ...prevState.hostlist,
                [newKeyName]: '',
              },
            }));
          }
        }
      );
    }
  }

  render() {
    const {
      activeTabs: { cloud },
    } = this.props;
    const { atlas, authSource, database, envConfig, hostlist, replicaSet, username } = this.state;
    const isAtlas = cloud === TEMPLATE_TYPE_ATLAS;

    return (
      <form className="uriwriter__form" autoComplete="off">
        {isAtlas ? (
          <label className="mongodb-form__prompt">
            <span className="mongodb-form__label">Atlas Connection String</span>
            <div style={{ width: '100%' }}>
              <textarea
                name="atlas"
                type="text"
                value={atlas}
                onChange={this.handleInputChange}
                rows="3"
                style={{ width: '100%' }}
                className="mongodb-form__input"
                placeholder={`mongo "mongodb+srv://clustername.mongodb.net/test" --username user`}
              />
              <div
                className={[
                  'atlascontrols__status',
                  'mongodb-form__status',
                  this.atlasFormHasError(atlas) && 'mongodb-form__status--invalid',
                ].join(' ')}
              >
                {this.atlasFormHasError(atlas)}
              </div>
            </div>
          </label>
        ) : (
          <React.Fragment>
            <div className="mongodb-form__prompt" style={{ display: 'block' }}>
              <div className="mongodb-form__label">Server deployment type</div>
              <ul className="guide__pills">
                {LOCAL_ENVS.map((localEnv, index) => (
                  <li
                    className={`uriwriter__toggle guide__pill ${envConfig === localEnv.key && 'guide__pill--active'}`}
                    key={index}
                  >
                    <span
                      id={localEnv.key.replace(/\s+/g, '-')}
                      onClick={() => this.handleLocalEnvChange(localEnv.key)}
                      role="button"
                      tabIndex={index}
                    >
                      {localEnv.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <label className="mongodb-form__prompt">
              <span className="mongodb-form__label">Username</span>
              <input
                name="username"
                type="text"
                value={username}
                onChange={this.handleInputChange}
                className="mongodb-form__input"
              />
            </label>
            <label className="mongodb-form__prompt mongodb-form__label">
              <span className="mongodb-form__label">Database Name</span>
              <input
                name="database"
                type="text"
                value={database}
                onChange={this.handleInputChange}
                className="mongodb-form__input"
              />
            </label>
            {envConfig === TEMPLATE_TYPE_REPLICA_SET && (
              <label className="mongodb-form__prompt">
                <span className="mongodb-form__label">replicaSet</span>
                <input
                  name="replicaSet"
                  type="text"
                  value={replicaSet}
                  onChange={this.handleInputChange}
                  className="mongodb-form__input"
                />
              </label>
            )}
            <label className="mongodb-form__prompt">
              <span className="mongodb-form__label">authSource</span>
              <input
                name="authSource"
                type="text"
                value={authSource}
                onChange={this.handleInputChange}
                className="mongodb-form__input"
              />
            </label>
            <label className="mongodb-form__prompt">
              <span className="mongodb-form__label">Servers</span>
              <div id="hostlist">
                {Object.entries(hostlist).map(([key, value], index) => {
                  const error = this.hostnameHasError(value);
                  return (
                    <React.Fragment key={index}>
                      <input
                        name={key}
                        type="text"
                        value={hostlist[key]}
                        onChange={this.handleInputChange}
                        className="mongodb-form__input"
                        placeholder="localhost:27017"
                      />
                      <div className={['mongodb-form__status', error && 'mongodb-form__status--invalid'].join(' ')}>
                        {error}
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </label>
          </React.Fragment>
        )}
      </form>
    );
  }
}

URIWriter.propTypes = {
  activeTabs: PropTypes.shape({
    cloud: PropTypes.string,
  }).isRequired,
  handleUpdateURIWriter: PropTypes.func.isRequired,
};
