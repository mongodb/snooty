import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TEMPLATE_TYPE_SELF_MANAGED, TEMPLATE_TYPE_REPLICA_SET } from './constants';
import { getLocalValue } from '../../utils/browser-storage';

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

export default class LocalForm extends Component {
  constructor(props) {
    super(props);

    this.hostlistCounter = 1;
    this.state = {
      hostInputs: {
        host0: '',
      },
      uri: {
        authSource: '',
        database: '',
        localEnv: TEMPLATE_TYPE_SELF_MANAGED,
        hostlist: [],
        replicaSet: '',
        username: '',
      },
    };
  }

  componentDidMount() {
    const { handleUpdateURIWriter } = this.props;
    const parentURI = getLocalValue('uri');

    // Populate forms from localStorage
    if (parentURI) {
      this.setState(
        prevState => ({
          uri: {
            ...prevState.uri,
            ...parentURI.localURI,
          },
        }),
        () => {
          handleUpdateURIWriter(this.state.uri); // eslint-disable-line react/destructuring-assignment
          this.populateHostInputs(parentURI.localURI.hostlist);
        }
      );
    }
  }

  populateHostInputs = hostlist => {
    // Populate the host input fields using the validated hostlist fetched from localStorage
    const hostInputs = {};
    if (hostlist) {
      hostlist.forEach(host => {
        hostInputs[`host${this.hostlistCounter}`] = host;
        this.hostlistCounter += 1;
      });
    }
    hostInputs[`host${this.hostlistCounter}`] = '';
    this.hostlistCounter += 1;
    this.setState({ hostInputs });
  };

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

  removeHost = name => {
    const { hostInputs } = this.state;
    const deletedState = Object.assign({}, hostInputs);
    delete deletedState[name];
    return deletedState;
  };

  // Set state.uri.hostlist from the values in the input fields
  updateHostlist = () => {
    const { handleUpdateURIWriter } = this.props;
    const { hostInputs } = this.state;
    this.setState(
      prevState => ({
        uri: {
          ...prevState.uri,
          hostlist: Object.values(hostInputs).filter(host => !this.hostnameHasError(host) && host !== ''),
        },
      }),
      () => handleUpdateURIWriter(this.state.uri) // eslint-disable-line react/destructuring-assignment
    );
  };

  updateHostInputs = (name, value) => {
    const { hostInputs } = this.state;

    let updatedHostInputs = hostInputs;
    // Delete empty input as long as we have more than one input displayed
    if (value === '' && Object.entries(hostInputs).length > 1) {
      updatedHostInputs = this.removeHost(name);
    } else {
      updatedHostInputs = {
        ...hostInputs,
        [name]: value,
      };

      if (!this.hostnameHasError(value) && !Object.values(hostInputs).includes('')) {
        const newKeyName = `host${this.hostlistCounter++}`; // eslint-disable-line no-plusplus
        updatedHostInputs[newKeyName] = '';
      }
    }
    this.setState({ hostInputs: updatedHostInputs }, () => this.updateHostlist());
  };

  toggleLocalEnv = localEnv => {
    const { handleUpdateURIWriter } = this.props;

    this.setState(
      prevState => ({
        uri: { ...prevState.uri, localEnv },
      }),
      () => handleUpdateURIWriter(this.state.uri) // eslint-disable-line react/destructuring-assignment
    );
  };

  handleInputChange = ({ target, target: { name, value } }) => {
    const { handleUpdateURIWriter } = this.props;

    if (name.includes('host')) {
      target.setCustomValidity(this.hostnameHasError(value));
      this.updateHostInputs(name, value);
    } else {
      this.setState(
        prevState => ({ uri: { ...prevState.uri, [name]: value } }),
        () => handleUpdateURIWriter(this.state.uri) // eslint-disable-line react/destructuring-assignment
      );
    }
  };

  render() {
    const {
      hostInputs,
      uri: { authSource, database, localEnv, replicaSet, username },
    } = this.state;
    return (
      <React.Fragment>
        <div className="mongodb-form__prompt" style={{ display: 'block' }}>
          <div className="mongodb-form__label">Server deployment type</div>
          <ul className="guide__pills">
            {LOCAL_ENVS.map((env, index) => (
              <li
                className={`uriwriter__toggle guide__pill ${localEnv === env.key && 'guide__pill--active'}`}
                key={index}
              >
                <span
                  id={env.key.replace(/\s+/g, '-')}
                  onClick={() => this.toggleLocalEnv(env.key)}
                  role="button"
                  tabIndex={index}
                >
                  {env.value}
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
          <span className="mongodb-form__label">Database name</span>
          <input
            name="database"
            type="text"
            value={database}
            onChange={this.handleInputChange}
            className="mongodb-form__input"
          />
        </label>
        {localEnv === TEMPLATE_TYPE_REPLICA_SET && (
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
            {Object.entries(hostInputs).map(([key, value], index) => {
              const error = this.hostnameHasError(value);
              return (
                <React.Fragment key={index}>
                  <input
                    name={key}
                    type="text"
                    value={hostInputs[key]}
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
    );
  }
}

LocalForm.propTypes = {
  handleUpdateURIWriter: PropTypes.func.isRequired,
};
