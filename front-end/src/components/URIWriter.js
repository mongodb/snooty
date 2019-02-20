import React, { Component } from 'react';

export const TEMPLATE_TYPE_SELF_MANAGED = 'local MongoDB';
export const TEMPLATE_TYPE_REPLICA_SET = 'local MongoDB with replica set';
export const TEMPLATE_TYPE_ATLAS_36 = 'Atlas (Cloud) v. 3.6';
export const TEMPLATE_TYPE_ATLAS_34 = 'Atlas (Cloud) v. 3.4';
export const TEMPLATE_TYPE_ATLAS = 'Atlas (Cloud)';

const LOCAL_ENVS = [TEMPLATE_TYPE_SELF_MANAGED, TEMPLATE_TYPE_REPLICA_SET];

export default class URIWriter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      atlas: '',
      authSource: '',
      database: '',
      env: this.props.templateType,
      hostlist: {
        host0: '',
      },
      replicaSet: '',
      username: '',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.hostlistCounter = 1;
  }

  handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    const { handleUpdateURIWriter } = this.props;

    event.preventDefault();

    if (name === 'atlas') {
      this.setState(
        { [name]: value },
        () => this.parseAtlasString(target, value, handleUpdateURIWriter)
      );
    } else if (name.includes('host')) {
      target.setCustomValidity(this.hostnameHasError(value));
      this.updateHostlist(name, value, handleUpdateURIWriter);
    } else {
      this.setState(
        { [name]: value },
        () => handleUpdateURIWriter(this.state)
      );
    }
  }

  handleEnvChange(env) {
    const { handleUpdateURIWriter } = this.props;

    this.setState(
      { env: env },
      () => handleUpdateURIWriter(this.state)
    );
  }

  updateHostlist(name, value, callback) {
    if (value === '' && Object.keys(this.state.hostlist).length > 1) {
      let deletedState = Object.assign({}, this.state.hostlist);
      delete deletedState[name];
      this.setState({ hostlist: deletedState }, () => {
          if (!this.hostnameHasError(value)) {
            callback(this.state);
          }
      });
    } else {
      this.setState({
        hostlist:
          {
            ...this.state.hostlist,
            [name]: value,
          }
        },
        () => {
          if (this.hostnameHasError(value) === '') {
            callback(this.state);
          }
          if (!Object.values(this.state.hostlist).includes('')) {
            const newKeyName = `host${this.hostlistCounter++}`;
            this.setState({
              hostlist:
                {
                  ...this.state.hostlist,
                  [newKeyName]: '',
                }
            });
          }
        }
      );
    }
  }

  hostnameHasError(host) {
    if (host === '') {
      return '';
    }

    const parsed = (/^\s*([^:\s]+)(?::(\d+))?\s*$/).exec(host);
    if (!parsed) {
      return 'Invalid host format: must match the format "hostname:port"';
    }

    const port = parseInt(parsed[2], 10);
    if (isNaN(port)) {
      return 'Missing port: host must match the format "hostname:port"';
    }

    if (port > 65535) {
      return 'Port number is too large';
    }

    return '';
  }

  atlasFormHasError(atlasString) {
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
  }

  clearURI(callback) {
    this.setState({
      authSource: '',
      database: '',
      env: this.props.templateType,
      hostlist: {
        host0: '',
      },
      replicaSet: '',
      ssl: '',
      username: '',
    }, () => typeof callback === 'function' && callback(this.state));
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

  parseShell(atlasString, callback) {
    const splitOnSpace = atlasString.split(' ');
    let splitOnSpaceClusterEnv = splitOnSpace[1];
    splitOnSpaceClusterEnv = splitOnSpaceClusterEnv.replace(/"/g, '');
    this.parseOutShellParams(splitOnSpace, callback);
    this.parseOutEnvAndClusters(splitOnSpaceClusterEnv, callback);

    return true;
  }

  parseTo3dot4(atlasString, callback) {
    const re = /(\S+):\/\/(\S+):(\S*)@(\S+)\/(\S+)\?(\S+)/;
    const matchesArray = atlasString.match(re);
    if (!matchesArray) {
      this.clearURI(callback);
      return;
    }

    let hostlist= {};
    matchesArray[4].split(',').forEach((host, index) => hostlist[`host${index}`] = host);
    this.setState({
      env: TEMPLATE_TYPE_ATLAS_34,
      username: matchesArray[2],
      hostlist: hostlist,
      database: matchesArray[5],
      ...this.parseURIParams(matchesArray[6]),
    }, () => callback(this.state));
  }

  parseTo3dot6(atlasString, callback) {
    const re = /(\S+):\/\/(\S+):(\S*)@(\S+)\/([^\s?]+)\?/;
    const matchesArray = atlasString.match(re);
    if (!matchesArray) {
      this.clearURI(callback);
      return;
    }

    const hostlist = { host0: matchesArray[4] };
    this.setState({
      env: TEMPLATE_TYPE_ATLAS_36,
      username: matchesArray[2],
      hostlist: hostlist,
      database: matchesArray[5],
    }, () => callback(this.state));
  }

  parseOutShellParams(splitOnSpace, callback) {
    let params = {};
    for (let i = 0; i < splitOnSpace.length; i += 1) {
      if (splitOnSpace[i].startsWith('--')) {
        if (!splitOnSpace[i + 1].startsWith('--')) {
          let splitKey = splitOnSpace[i].replace('--', '');
          let splitValue = splitOnSpace[i + 1];

          if (splitKey === 'authenticationDatabase') {
            splitKey = 'authSource';
          }

          if (splitKey === 'password') {
            continue;
          }

          // sometimes the next string is another parameter,
          // ignore those as they are canned
          if (!splitValue.startsWith('--')) {
            splitValue = splitValue.replace('<', '').replace('>', '');
            params[splitKey] = splitValue;
          }
        }
      }
    }
    this.setState({
      ...this.state,
      ...params,
    }, () => callback(this.state));
  }

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
      let hostlist= {};
      const hostListString = shellArray[2];
      hostListString.split(',').forEach((host, index) => hostlist[`host${index}`] = host);
      this.setState({
        env: TEMPLATE_TYPE_ATLAS_34,
        database: shellArray[6],
        hostlist: hostlist,
        ...this.parseURIParams(shellArray[7]),
      }, () => callback(this.state));
    } else {
      const hostlist = { host0: shellArray[4] };
      this.setState({
        env: TEMPLATE_TYPE_ATLAS_36,
        database: shellArray[6],
        hostlist: hostlist,
      }, () => callback(this.state));
    }
  }

  parseURIParams(shellString) {
    const params = {};
    shellString.split('&').forEach(param => {
      const [key, value] = param.split('=');
      if (key !== 'password') {
        params[key] = value;
      }
    });
    return params;
  }

  render() {
    const { templateType } = this.props;
    const { hostlist } = this.state;
    const isAtlas = templateType.includes(TEMPLATE_TYPE_ATLAS);

    return (
      <form className="uriwriter__form" autoComplete="off">
        {isAtlas ? (
          <label className="mongodb-form__prompt">
            <span className="mongodb-form__label">Atlas Connection String</span>
            <div style={{width: '100%'}}>
              <textarea
                name="atlas"
                type="text"
                value={this.state.atlas}
                onChange={this.handleInputChange}
                rows="3"
                style={{width: '100%'}}
                className="mongodb-form__input"
                placeholder={`mongo "mongodb+srv://clustername.mongodb.net/test" --username user`}
              />
              <div
                className={[
                  'atlascontrols__status',
                  'mongodb-form__status',
                  this.atlasFormHasError(this.state.atlas) && 'mongodb-form__status--invalid',
                ].join(' ')}
              >
                {this.atlasFormHasError(this.state.atlas)}
              </div>
            </div>
          </label>
        ) : (
          <React.Fragment>
            <div className="mongodb-form__prompt" style={{display: 'block'}}>
              <div className="mongodb-form__label">Server deployment type</div>
              <ul className="guide__pills">
                {LOCAL_ENVS.map((env, index) => (
                  <li className='tab-strip__element'
                    id={env.replace(/\s+/g, '-')}
                    key={index}
                    onClick={() => this.handleEnvChange(env)}
                    className={`uriwriter__toggle guide__pill ${this.state.env === env && 'guide__pill--active'}`}
                  >
                      {env}
                  </li>
                ))}
              </ul>
            </div>
            <label className="mongodb-form__prompt">
              <span className="mongodb-form__label">Username</span>
              <input
                name="username"
                type="text"
                value={this.state.username}
                onChange={this.handleInputChange}
                className="mongodb-form__input"
              />
            </label>
            <label className="mongodb-form__prompt">
              <span className="mongodb-form__label">Database Name</span>
              <input
                name="database"
                type="text"
                value={this.state.database}
                onChange={this.handleInputChange}
                className="mongodb-form__input"
              />
            </label>
            {this.state.env === TEMPLATE_TYPE_REPLICA_SET && (
              <label className="mongodb-form__prompt">
                <span className="mongodb-form__label">replicaSet</span>
                <input
                  name="replicaSet"
                  type="text"
                  value={this.state.replicaSet}
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
                value={this.state.authSource}
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
                    <div
                      className={[
                        'mongodb-form__status',
                        error && 'mongodb-form__status--invalid',
                      ].join(' ')}
                    >
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
