import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import keyBy from 'lodash.keyby';
import isEmpty from 'lodash.isempty';
import Button from '@leafygreen-ui/button';
import { css, cx } from '@leafygreen-ui/emotion';
import { isBrowser } from '../utils/is-browser';
import { theme } from '../theme/docsTheme';
import { fetchDocuments } from '../utils/realm';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import { BRANCHES_COLLECTION } from '../build-constants';
import Select from './Select';

const SELECT_WIDTH = '336px';

const selectStyle = css`
  margin-bottom: ${theme.size.medium};
  width: ${SELECT_WIDTH};

  @media ${theme.screenSize.upToSmall} {
    width: 100%;
  }
`;

const isPrimaryBranch = (version) => {
  return version === 'main' || version === 'master';
};

const prefixVersion = (version) => {
  if (!version) return null;
  // Display as "Version X" on menu if numeric version and remove v from version name
  const versionNumber = version.replace('v', '').split()[0];
  // if branch is 'master' or 'main', show as latest
  if (isPrimaryBranch(versionNumber)) {
    return 'latest';
  }
  return `Version ${versionNumber}`;
};

// An unversioned docs site defined as a product with a single
// option of 'master' or 'main'
const isVersioned = (versionOptions) => {
  return !(versionOptions.length === 1 && isPrimaryBranch(versionOptions[0]));
};

// Validation for necessary url fields to bypass errors
const hasValidHostName = (repoDocument) => {
  if (!repoDocument?.url?.dotcomprd || !repoDocument?.prefix?.dotcomprd) return false;
  return true;
};

// Add mms-docs to reposMap. It does not have a document in repos_branches collection.
// TODO: Remove when mms-docs is added to repos_branches
const addOldGenToReposMap = (reposMap) => {
  const oldGenRepos = {
    mms: {
      displayName: 'MongoDB Ops Manager',
      url: { dotcomprd: 'http://mongodb.com/' },
      prefix: { dotcomprd: 'docs/ops-manager' },
    },
  };
  return {
    ...oldGenRepos,
    ...reposMap,
  };
};

const DeprecatedVersionSelector = ({ metadata: { deprecated_versions: deprecatedVersions } }) => {
  const { reposDatabase } = useSiteMetadata();
  const [product, setProduct] = useState('');
  const [version, setVersion] = useState('');
  const [reposMap, setReposMap] = useState({});

  const updateProduct = useCallback(({ value }) => {
    setProduct(value);
    setVersion('');
  }, []);
  const updateVersion = useCallback(({ value }) => setVersion(value), []);
  const buttonDisabled = !(product && version);

  // Fetch repos_branches for `displayName` and url
  useEffect(() => {
    if (reposDatabase) {
      fetchDocuments(reposDatabase, BRANCHES_COLLECTION).then((resp) => {
        const reposBranchesMap = keyBy(resp, 'project');
        const reposBranchesMapWithOldGen = addOldGenToReposMap(reposBranchesMap);
        setReposMap(reposBranchesMapWithOldGen);
      });
    }
  }, [reposDatabase]);

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
    if (buttonDisabled || isEmpty(reposMap) || !hasValidHostName(reposMap[product])) {
      return null;
    }

    // Utilizing hardcoded env because legacy sites are not available on dev/stage
    const hostName = reposMap[product].url.dotcomprd + reposMap[product].prefix.dotcomprd;
    const versionOptions = deprecatedVersions[product];
    const versionName = isVersioned(versionOptions) ? version : '';
    return `${hostName}/${versionName}`;
  };

  const productChoices = deprecatedVersions
    ? Object.keys(deprecatedVersions)
        .map((product) => ({
          text: reposMap[product]?.displayName,
          value: product,
        }))
        // Ensure invalid entries do not break selector
        .filter(({ text }) => !!text)
    : [];

  const versionChoices = deprecatedVersions[product]
    ? deprecatedVersions[product].map((version) => ({
        text: prefixVersion(version),
        value: version,
      }))
    : [];

  return (
    <>
      <Select
        className={cx(selectStyle)}
        choices={productChoices}
        defaultText="Product"
        label="Select a Product"
        onChange={updateProduct}
        value={product}
      />
      <Select
        className={cx(selectStyle)}
        choices={versionChoices}
        defaultText="Version"
        disabled={product === ''}
        label="Select a Version"
        onChange={updateVersion}
        value={version}
      />
      <Button variant="primary" title="View Documentation" href={generateUrl()} disabled={buttonDisabled}>
        View Documentation
      </Button>
    </>
  );
};

DeprecatedVersionSelector.propTypes = {
  metadata: PropTypes.object.isRequired,
};

export default DeprecatedVersionSelector;
