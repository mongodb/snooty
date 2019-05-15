import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TEMPLATE_TYPE_ATLAS_34, TEMPLATE_TYPE_ATLAS_36 } from './constants';
import { getLocalValue, setLocalValue } from '../../localStorage';

const EMPTY_URI = {
  atlasVersion: TEMPLATE_TYPE_ATLAS_36,
  authSource: '',
  database: '',
  hostlist: [],
  replicaSet: '',
  ssl: '',
  username: '',
};

export default class CloudForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      connectionString: '',
      uri: { ...EMPTY_URI },
    };
  }

  componentDidMount() {
    const connectionString = getLocalValue('connectionString');
    if (connectionString) {
      this.setState(
        {
          connectionString,
        },
        () => this.parseConnectionString(connectionString)
      );
    }
  }

  clearURI = () => {
    const { handleUpdateURIWriter } = this.props;
    this.setState(
      prevState => ({
        connectionString: prevState.connectionString,
        uri: {
          ...EMPTY_URI,
        },
      }),
      () => handleUpdateURIWriter(this.state.uri) // eslint-disable-line react/destructuring-assignment
    );
  };

  formHasError = str => {
    const re3dot4 = /(\S+):\/\/(\S+):(\S*)@(\S+)\/(\S+)\?(\S+)/;
    const re3dot6 = /(\S+):\/\/(\S+):(\S*)@(\S+)\/([^\s?]+)\?/;

    if (!str || str === '' || str.match(re3dot4) || str.match(re3dot6) || str.indexOf(' --') > -1) {
      return '';
    }

    return 'Connection string could not be parsed';
  };

  parseURIParams = shellString => {
    const params = {};
    if (!shellString) {
      return params;
    }
    shellString.split('&').forEach(param => {
      const [key, value] = param.split('=');
      if (key !== 'password') {
        params[key] = value;
      }
    });
    return params;
  };

  parseOutEnvAndClusters = splitOnSpaceClusterEnv => {
    // depending on whether this is 3.6 or 3.4 the cluster info looks slightly different
    // 3.4 uses the URI to pass in a replica set name
    let shellMatch = /(\w+):\/\/((\S+)(:)+(\S+))\/(\w+)?\?(\S+)/;
    const shellMatch36 = /((\w+)\+(\w+)):\/\/((\S+))\/(\w+)/;
    if (splitOnSpaceClusterEnv.startsWith('mongodb+srv')) {
      shellMatch = shellMatch36;
    }
    const shellArray = splitOnSpaceClusterEnv.match(shellMatch);
    if (!shellArray) {
      this.clearURI();
      return [{}, true];
    }

    if (shellArray[1] === 'mongodb') {
      const hostlist = shellArray[2].split(',');
      return [
        {
          atlasVersion: TEMPLATE_TYPE_ATLAS_34,
          database: shellArray[6],
          hostlist,
          ...this.parseURIParams(shellArray[7]),
        },
        false,
      ];
    }
    const hostlist = [shellArray[4]];
    return [
      {
        atlasVersion: TEMPLATE_TYPE_ATLAS_36,
        database: shellArray[6],
        hostlist,
      },
      false,
    ];
  };

  parseOutShellParams = splitOnSpace => {
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
    return params;
  };

  parseShell = atlasString => {
    const { handleUpdateURIWriter } = this.props;
    const splitOnSpace = atlasString.split(' ');
    let splitOnSpaceClusterEnv = splitOnSpace[1];
    splitOnSpaceClusterEnv = splitOnSpaceClusterEnv.replace(/"/g, '');
    const [envAndClusters, error] = this.parseOutEnvAndClusters(splitOnSpaceClusterEnv);
    if (error) {
      this.clearURI();
      return false;
    }

    this.setState(
      {
        uri: {
          ...this.parseOutShellParams(splitOnSpace),
          ...envAndClusters,
        },
      },
      () => handleUpdateURIWriter(this.state.uri) // eslint-disable-line react/destructuring-assignment
    );

    return true;
  };

  parseAtlasString = (atlasString, atlasVersion) => {
    const { handleUpdateURIWriter } = this.props;
    const re3dot4 = /(\S+):\/\/(\S+):(\S*)@(\S+)\/(\S+)\?(\S+)/;
    const re3dot6 = /(\S+):\/\/(\S+):(\S*)@(\S+)\/([^\s?]+)\?/;
    const matchesArray = atlasString.match(re3dot4) || atlasString.match(re3dot6);
    if (!matchesArray) {
      this.clearURI();
      return;
    }

    const [, , username, , hostlist, database, uriParams] = matchesArray;

    const hostlistArr = hostlist.split(',');
    this.setState(
      {
        uri: {
          ...EMPTY_URI,
          atlasVersion,
          database,
          hostlist: hostlistArr,
          username,
          ...this.parseURIParams(uriParams),
        },
      },
      () => handleUpdateURIWriter(this.state.uri) // eslint-disable-line react/destructuring-assignment
    );
  };

  parseConnectionString = (pastedValue, target = undefined) => {
    const atlasString = pastedValue.replace(/[\n\r]+/g, '').trim();
    if (target) {
      const error = target.setCustomValidity(this.formHasError(atlasString));
      if (error) {
        this.clearURI();
      }
    }

    if (atlasString.indexOf(' --') > -1) {
      return this.parseShell(atlasString);
    }

    if (atlasString.startsWith('mongodb+srv')) {
      return this.parseAtlasString(atlasString, TEMPLATE_TYPE_ATLAS_36);
    }
    return this.parseAtlasString(atlasString, TEMPLATE_TYPE_ATLAS_34);
  };

  handleInputChange = ({ target, target: { value } }) => {
    this.setState({ connectionString: value }, () => {
      this.parseConnectionString(value, target);
      setLocalValue('connectionString', value);
    });
  };

  render() {
    const { connectionString } = this.state;
    return (
      <label className="mongodb-form__prompt">
        <span className="mongodb-form__label">Atlas connection string</span>
        <div style={{ width: '100%' }}>
          <textarea
            name="connectionString"
            type="text"
            value={connectionString}
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
              this.formHasError(connectionString) && 'mongodb-form__status--invalid',
            ].join(' ')}
          >
            {this.formHasError(connectionString)}
          </div>
        </div>
      </label>
    );
  }
}

CloudForm.propTypes = {
  handleUpdateURIWriter: PropTypes.func.isRequired,
};
