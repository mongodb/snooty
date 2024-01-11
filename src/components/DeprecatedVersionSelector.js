import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { keyBy, isEmpty } from 'lodash';
import Button from '@leafygreen-ui/button';
import Icon from '@leafygreen-ui/icon';
import { css, cx } from '@leafygreen-ui/emotion';
import { isBrowser } from '../utils/is-browser';
import { theme } from '../theme/docsTheme';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import { useAllDocsets } from '../hooks/useAllDocsets';
import { fetchDocsets } from '../utils/realm';
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
  // if branch is 'master' or 'main', show as latest--> do we still want to do this? will this case ever happen? if so, should it still be lower case????
  if (isPrimaryBranch(versionNumber)) {
    return 'Latest';
  }
  return `Version ${versionNumber}`;
};

// An unversioned docs site defined as a product with a single
// option of 'master' or 'main'
const isVersioned = (versionChoices) => {
  return !(versionChoices?.length === 1 && isPrimaryBranch(versionChoices[0].value.gitBranchName));
};

// Validation for necessary url fields to bypass errors
const hasValidHostName = (repoDocument) => {
  if (!repoDocument?.url?.dotcomprd || !repoDocument?.prefix?.dotcomprd) return false;
  return true;
};

const DeprecatedVersionSelector = ({ metadata: { deprecated_versions: deprecatedVersions } }) => {
  const { reposDatabase } = useSiteMetadata();
  const reposBranchesBuildData = useAllDocsets().filter((project) => !!project.hasEolVersions);
  const reposBranchesBuildDataMap = keyBy(reposBranchesBuildData, 'project');
  const [product, setProduct] = useState('');
  const [version, setVersion] = useState('');
  const [reposMap, setReposMap] = useState(reposBranchesBuildDataMap);

  const updateProduct = useCallback(({ value }) => {
    setProduct(value);
    setVersion('');
  }, []);
  const updateVersion = useCallback(({ value }) => setVersion(value), []);
  const buttonDisabled = !(product && version);

  // Fetch docsets for url
  useEffect(() => {
    if (reposDatabase) {
      fetchDocsets(reposDatabase)
        .then((resp) => {
          const reposBranchesMap = keyBy(
            resp.filter((project) => !!project.hasEolVersions),
            'project'
          );
          if (reposBranchesMap.size > 0) setReposMap(reposBranchesMap);
        })
        .catch((error) => {
          console.error(`ERROR: could not access ${reposDatabase} for dropdown data.`);
        });
    }
  }, [reposDatabase]);

  //this can be removed? i dont think its used anywhere
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
    const versionName = isVersioned(versionChoices) ? version.gitBranchName : '';
    return `${hostName}/${versionName}`;
  };

  const alphabetize = (product1, product2) => {
    return product1.text.localeCompare(product2.text);
  };

  const productChoices = reposMap
    ? Object.keys(reposMap)
        .map((product) => {
          return {
            text: reposMap[product]?.displayName,
            value: product,
          };
        })
        // Ensure invalid entries do not break selector
        .filter(({ text }) => !!text)
        .sort(alphabetize)
    : [];

  const versionChoices = reposMap[product]?.branches
    ? reposMap[product]?.branches
        .map((version) => {
          //change this to eol_type
          if (!!version.eol_type)
            return {
              text: prefixVersion(version.gitBranchName),
              value: version,
              icon: version.eol_type === 'download' ? <Icon glyph="Download" /> : '',
            };
          else return null;
        })
        .filter((versionChoice) => !!versionChoice)
        .sort()
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
      ></Select>
      <Button
        variant="primary"
        title="View or Download Documentation"
        rightGlyph={version?.eol_type === 'download' ? <Icon glyph="Download" /> : ''}
        href={generateUrl()}
        disabled={buttonDisabled}
      >
        {version?.eol_type === 'download' ? 'Download Documentation' : 'View Documentation'}
      </Button>
    </>
  );
};

DeprecatedVersionSelector.propTypes = {
  metadata: PropTypes.object.isRequired,
};

export default DeprecatedVersionSelector;
