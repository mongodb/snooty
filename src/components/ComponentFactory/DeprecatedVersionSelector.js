import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import Button from '@leafygreen-ui/button';
import styled from '@emotion/styled';
import { getSiteUrl } from '../../utils/get-site-url';
import { isBrowser } from '../../utils/is-browser';
import { theme } from '../../theme/docsTheme';
import Select from '../Select';

const SELECT_WIDTH = '336px';

const StyledSelect = styled(Select)`
  margin-bottom: ${theme.size.medium};
  width: ${SELECT_WIDTH};

  @media ${theme.screenSize.upToSmall} {
    width: 100%;
  }
`;

const PROPERTY_NAME_MAPPING = {
  'atlas-open-service-broker': 'MongoDB Atlas Open Service Broker on Kubernetes',
  'bi-connector': 'MongoDB Connector for BI',
  charts: 'MongoDB Charts',
  cloud: 'MongoDB Atlas',
  compass: 'MongoDB Compass',
  docs: 'MongoDB Server',
  drivers: 'MongoDB Drivers',
  'kafka-connector': 'MongoDB Kafka Connector',
  'kubernetes-operator': 'MongoDB Enterprise Kubernetes Operator',
  mongocli: 'MongoDB CLI',
  mongoid: 'Mongoid',
  mms: 'MongoDB Ops Manager',
  'ruby-driver': 'MongoDB Ruby Driver',
  'spark-connector': 'MongoDB Connector for Spark',
};

const fullProductName = (property) => {
  if (!property) return null;
  // Display full product name on product dropdown
  return PROPERTY_NAME_MAPPING[property.replace('_', '-')] || property;
};

const prefixVersion = (version) => {
  if (!version) return null;
  // Display as "Version X" on menu if numeric version and remove v from version name
  const versionNumber = version.replace('v', '').split()[0];
  const isNumeric = (version) => !isNaN(versionNumber);
  return `${isNumeric(version) ? 'Version ' : ''}${versionNumber}`;
};

const DeprecatedVersionSelector = ({ metadata: { deprecated_versions: deprecatedVersions } }) => {
  const [product, setProduct] = useState('');
  const [version, setVersion] = useState('');
  const updateProduct = useCallback(({ value }) => {
    setProduct(value);
    setVersion('');
  }, []);
  const updateVersion = useCallback(({ value }) => setVersion(value), []);
  const buttonDisabled = !(product && version);

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
    // Our current LG button version has a bug where a disabled button with an href allows the disabled
    // button to be clickable. This logic can be removed when LG button is version >= 12.0.4.
    if (buttonDisabled) {
      return null;
    }

    const hostName = getSiteUrl(product);
    return ['docs', 'mms', 'cloud-docs'].includes(product)
      ? `${hostName}/${version}`
      : `${hostName}/${product}/${version}`;
  };

  const productChoices = deprecatedVersions
    ? Object.keys(deprecatedVersions).map((product) => ({
        text: fullProductName(product),
        value: product,
      }))
    : [];

  const versionChoices = deprecatedVersions[product]
    ? deprecatedVersions[product].map((version) => ({
        text: prefixVersion(version),
        value: version,
      }))
    : [];

  return (
    <>
      <StyledSelect
        choices={productChoices}
        defaultText="Product"
        label="Select a Product"
        onChange={updateProduct}
        value={product}
      />
      <StyledSelect
        choices={versionChoices}
        defaultText="Version"
        disabled={product === ''}
        label="Select a Version"
        onChange={updateVersion}
        value={version}
      />
      <Button variant="primary" title="View Documentation" size="large" href={generateUrl()} disabled={buttonDisabled}>
        View Documentation
      </Button>
    </>
  );
};

DeprecatedVersionSelector.propTypes = {
  metadata: PropTypes.object.isRequired,
};

export default DeprecatedVersionSelector;
