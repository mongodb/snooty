import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { generatePathPrefix } from '../utils/generate-path-prefix';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import dropdownStyles from '../styles/version-dropdown.module.css';
import { PROPERTY_NAME_MAPPING } from '../constants';
import queryString from 'query-string';
import Button from '@leafygreen-ui/button';

const DeprecatedVersionSelector = ({ deprecatedVersions, slug }) => {
  const siteMetadata = useSiteMetadata();
  const [hidden, setHidden] = useState(true);
  const [productDropdownValue, setProductDropdownValue] = useState('Any Product');
  const [versionDropdownValue, setVersionDropdownValue] = useState('Any Version');

  const prefixVersion = version => {
    // Display as "Version X" on menu if numeric version
    const isNumeric = version => !isNaN(version.split()[0]);
    return `${isNumeric(version) ? 'Version ' : ''}${version}`;
  };

  const getProductName = property => {
    // Display full product name on product dropdown
    return `${PROPERTY_NAME_MAPPING[property]}`;
  };

  const changeProduct = property => {
    //Update product dropdown value and update version dropdown with corresponding legacy versions
    setProductDropdownValue(property);
    updateVersionDropdown(property);
  };

  const changeVersion = version => {
    //Update version dropdown value and update create link to the legacy doc
    setVersionDropdownValue(version);
    createURL(version);
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

  let url;
  const createURL = version => {
    url = `${generatePathPrefix({ ...siteMetadata, parserBranch: version })}/${slug}`;
  };

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

  const urlQueryString = window.location.search;
  let currentProperty = '';
  if (urlQueryString !== '') {
    const queryStringValue = queryString.parse(urlQueryString);
    currentProperty = queryStringValue.site;
  }

  const wrapperRef = useRef(null);
  useOutsideHandler(wrapperRef);

  return (
    <div ref={wrapperRef} className="btn-group legacy-version-selector">
      <span className="product-text">
        <b>Select a Product</b>
      </span>
      <button
        type="button"
        className="product-button dropdown-toggle"
        onClick={() => setHidden(!hidden)}
        title="Select a Product"
        value={currentProperty !== '' ? currentProperty : productDropdownValue}
      >
        {currentProperty !== ''
          ? (getProductName(currentProperty), changeProduct(currentProperty))
          : productDropdownValue}
        <span className="caret"></span>
      </button>
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
                  {getProductName(property)}
                </a>
              </li>
            );
          })}
        </ul>
      )}

      <br></br>

      <span className="version-text">
        <b>Select a Version</b>
      </span>
      <button
        type="button"
        className="version-button dropdown-toggle"
        onClick={() => setHidden(!hidden)}
        title="Select a Version"
        disabled={productDropdownValue === 'Any Product'}
      >
        {versionDropdownValue}
        <span className="caret"></span>
      </button>
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
                    setHidden(hidden);
                  }}
                >
                  {prefixVersion(version)}
                </a>
              </li>
            );
          })}
        </ul>
      )}

      <br></br>

      <Button variant="primary" className="create-item-button" title="Create an item" size="large" href={url}>
        View Document
      </Button>
    </div>
  );
};

DeprecatedVersionSelector.propTypes = {
  deprecatedVersions: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  slug: PropTypes.string.isRequired,
};

export default DeprecatedVersionSelector;
