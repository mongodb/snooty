import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import Button from '@leafygreen-ui/button';
import { isBrowser } from '../../utils/is-browser';
import dropdownStyles from '../../styles/version-dropdown.module.css';

const PROPERTY_NAME_MAPPING = {
  manual: 'MongoDB Server',
  cloud: 'MongoDB Atlas',
  compass: 'MongoDB Compass',
  charts: 'MongoDB Charts',
  atlas_open_service_broker: 'MongoDB Atlas Open Service Broker on Kubernetes',
  k8s_operator: 'MongoDB Enterprise Kubernetes Operator',
  mms: 'MongoDB Ops Manager',
  bi_connector: 'MongoDB Connector for BI',
  spark_connector: 'MongoDB Connector for Spark',
  kafka_connector: 'MongoDB Kafka Connector',
  mongoid: 'Mongoid',
  drivers: 'MongoDB Drivers',
  ruby_driver: 'Ruby MongoDB Driver',
};

const fullProductName = property => {
  if (!property) return null;
  // Display full product name on product dropdown
  return PROPERTY_NAME_MAPPING[property.replace('-', '_')] || property;
};

const prefixVersion = version => {
  if (!version) return null;
  // Display as "Version X" on menu if numeric version and remove v from version name
  const versionNumber = version.replace('v', '').split()[0];
  const isNumeric = version => !isNaN(versionNumber);
  return `${isNumeric(version) ? 'Version ' : ''}${versionNumber}`;
};

const Dropdown = ({ active, disabled = false, handleClick, placeholder, title, transform, values }) => {
  const [hidden, setHidden] = useState(true);
  return (
    <React.Fragment>
      <Button
        disabled={disabled}
        variant="default"
        className="dropdown-toggle"
        title={title}
        onClick={() => setHidden(!hidden)}
        size="large"
      >
        {transform(active) || placeholder}
        <span className={['caret', dropdownStyles.caret].join(' ')}></span>
      </Button>
      {!hidden && (
        <ul className={['dropdown-menu', dropdownStyles.menu].join(' ')} role="menu">
          {values.map(val => {
            return (
              <li key={val}>
                <a
                  onClick={() => {
                    handleClick(val);
                    setHidden(true);
                  }}
                >
                  {transform(val)}
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </React.Fragment>
  );
};

const DeprecatedVersionSelector = ({ metadata: { deprecated_versions: deprecatedVersions } }) => {
  const [product, setProduct] = useState(null);
  const [version, setVersion] = useState(null);

  useEffect(() => {
    if (isBrowser) {
      // Extract the value of 'site' query string from the page url to pre-select product
      const { site } = queryString.parse(window.location.search);
      if (site && Object.keys(deprecatedVersions).includes(site)) {
        setProduct(site);
      }
    }
  }, [deprecatedVersions]);

  const generateUrl = () => {
    let hostName;
    switch (product) {
      case 'mms':
        hostName = 'https://docs.opsmanager.mongodb.com';
        break;
      case 'cloud':
        hostName = 'https://docs.atlas.mongodb.com';
        break;
      default:
        hostName = 'https://docs.mongodb.com';
    }
    return ['manual', 'mms', 'cloud'].includes(product)
      ? `${hostName}/${version}`
      : `${hostName}/${product}/${version}`;
  };

  return (
    <div className="btn-group legacy-version-selector">
      <div className="btn-group">
        <h3>Select a Product</h3>
        <Dropdown
          active={product}
          handleClick={key => {
            setProduct(key);
            setVersion(null);
          }}
          placeholder="Any Product"
          title="Select Product"
          transform={fullProductName}
          values={Object.keys(deprecatedVersions)}
        />
      </div>

      <br></br>

      <div className="btn-group">
        <h3>Select a Version</h3>

        <Dropdown
          active={version}
          disabled={product === null}
          handleClick={key => {
            setVersion(key);
          }}
          placeholder="Any Version"
          title="Select Version"
          transform={prefixVersion}
          values={deprecatedVersions[product]}
        />
      </div>

      <br></br>

      <div className="btn-group">
        <Button
          variant="primary"
          title="View Documentation"
          size="large"
          href={generateUrl()}
          disabled={!(product && version)}
        >
          View Documentation
        </Button>
      </div>
    </div>
  );
};

DeprecatedVersionSelector.propTypes = {
  metadata: PropTypes.object.isRequired,
  slug: PropTypes.string.isRequired,
};

export default DeprecatedVersionSelector;
