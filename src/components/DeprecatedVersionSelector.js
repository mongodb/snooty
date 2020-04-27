import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import dropdownStyles from '../styles/version-dropdown.module.css';
import { PROPERTY_NAME_MAPPING } from '../constants';
import queryString from 'query-string';
import Button from '@leafygreen-ui/button';

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
  const [hidden, setHidden] = useState(true);
  const [productDropdownValue, setProductDropdownValue] = useState(null);
  const [versionDropdownValue, setVersionDropdownValue] = useState(null);

  const changeProduct = property => {
    setProductDropdownValue(fullProductName(property));
  };

  const changeVersion = version => {
    setVersionDropdownValue(prefixVersion(version));
  };

  let legacyVersions = [];
  const updateVersionDropdown = property => {
    // Update the list of deprecated versions based on property
    Object.keys(deprecatedVersions).forEach(key => {
      if (key === property) {
        legacyVersions = deprecatedVersions[property];
      }
    });
  };

  let finalUrl, hostName;
  const generateURL = (property, version) => {
    // Put together the final document url
    switch (property) {
      case 'mms':
        hostName = 'https://docs.opsmanager.mongodb.com';
        break;
      case 'cloud':
        hostName = 'https://docs.atlas.mongodb.com';
        break;
      default:
        hostName = 'https://docs.mongodb.com';
    }
    finalUrl =
      property === 'manual' || property === 'mms' || property === 'mms'
        ? `${hostName}/${version}`
        : `${hostName}/${property}/${version}`;
  };

  // Extract the value of 'site' query string from the page url to determine if a product should be pre-selected
  const urlQueryString = window.location.search;
  let currentProperty = '';
  if (urlQueryString !== '') {
    const queryStringValue = queryString.parse(urlQueryString);
    currentProperty = queryStringValue.site;
    changeProduct(currentProperty);
  }

  const useOutsideHandler = ref => {
    // Close dropdown if user clicks outside of the Version button
    const handleClickOutside = event => {
      if (ref.current && !ref.current.contains(event.target)) {
        setHidden(true);
      }
    };

    useEffect(() => {
      // Bind the event listener
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener('mousedown', handleClickOutside);
      };
    });
  };

  const wrapperRef = useRef(null);
  useOutsideHandler(wrapperRef);

  return (
    <div ref={wrapperRef} className="btn-group legacy-version-selector">
      {/* TODO: implement dropdown to using leafygreen's
        <select> component once its ready for use: https://jira.mongodb.org/browse/PD-271 */}

      <div class="btn-group">
        <h3>Select a Product</h3>
        <Dropdown
          active={productDropdownValue}
          handleClick={key => {
            updateVersionDropdown(key);
            setProductDropdownValue(key);
            setVersionDropdownValue(null);
          }}
          placeholder="Any Product"
          title="Select Product"
          transform={fullProductName}
          values={Object.keys(deprecatedVersions)}
        />
        {/*
        <Button
          variant="default"
          className="product-button dropdown-toggle"
          title="Select Product"
          onClick={() => setHidden(!hidden)}
          size="large"
          value={productDropdownValue}
        >
          {productDropdownValue}
          <span className={['caret', dropdownStyles.caret].join(' ')}></span>
        </Button>
        {!hidden && (
          <ul className={['dropdown-menu', dropdownStyles.menu].join(' ')} role="menu">
            {Object.keys(deprecatedVersions).map(property => {
              return (
                <li value={property}>
                  <a
                    className="product-selector"
                    href="#!"
                    onClick={() => {
                      changeProduct(property);
                      setHidden(hidden);
                    }}
                  >
                    {fullProductName(property)}
                  </a>
                </li>
              );
            })}
          </ul>
        )}
        */}
      </div>

      <br></br>

      <div class="btn-group">
        <h3>Select a Version</h3>

        <Dropdown
          active={versionDropdownValue}
          disabled={productDropdownValue === null}
          handleClick={key => {
            setVersionDropdownValue(key);
          }}
          placeholder="Any Version"
          title="Select Version"
          transform={prefixVersion}
          values={deprecatedVersions[productDropdownValue]}
        />

        {/* <Button
          variant="default"
          className="version-button dropdown-toggle"
          title="Select version"
          onClick={() => setHidden(!hidden)}
          size="medium"
          value={versionDropdownValue}
          disabled={productDropdownValue === 'Any Product'}
        >
          {versionDropdownValue}
          <span className={['caret', dropdownStyles.caret].join(' ')}></span>
        </Button>
        {!hidden && (
          <ul className={['dropdown-menu', dropdownStyles.menu].join(' ')} role="menu">
            {legacyVersions.map(version => {
              return (
                <li value={version}>
                  <a
                    className="version-selector"
                    href="#!"
                    onClick={() => {
                      changeVersion(version);
                      generateURL(productDropdownValue, version);
                      setHidden(hidden);
                    }}
                  >
                    {prefixVersion(version)}
                  </a>
                </li>
              );
            })}
          </ul>
        )}*/}
      </div>

      <br></br>

      <div class="btn-group">
        <Button
          variant="primary"
          title="View Documentation"
          size="large"
          href={finalUrl}
          disabled={!(productDropdownValue && versionDropdownValue)}
        >
          View Documentation
        </Button>
      </div>
    </div>
  );
};

DeprecatedVersionSelector.propTypes = {
  deprecatedVersions: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  slug: PropTypes.string.isRequired,
};

export default DeprecatedVersionSelector;
