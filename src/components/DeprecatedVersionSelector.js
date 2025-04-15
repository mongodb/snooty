import React, { useCallback, useEffect, useState, useMemo } from 'react';
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
import { sortVersions } from '../utils/sort-versioned-branches';
import { disabledStyle } from '../styles/button';
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
  // Display as "Version X" on menu if numeric version and remove "v" or "Version" from version name
  const versionNumber = version.replace(/v|Version /g, '').split()[0];
  // if branch is 'master' or 'main', show as latest
  if (isPrimaryBranch(versionNumber)) {
    return 'Latest';
  }
  return `Version ${versionNumber}`;
};

// Validation for necessary url fields to bypass errors
const hasValidHostName = (repoDocument) => {
  if (!repoDocument?.url?.dotcomprd || !repoDocument?.prefix?.dotcomprd) return false;
  return true;
};

const DeprecatedVersionSelector = () => {
  const { reposDatabase } = useSiteMetadata();
  const reposBranchesBuildData = useAllDocsets().filter((project) => project.hasEolVersions);
  const reposBranchesBuildDataMap = keyBy(reposBranchesBuildData, 'project');
  const [product, setProduct] = useState('');
  const [version, setVersion] = useState('');
  const [reposMap, setReposMap] = useState(reposBranchesBuildDataMap);

  const alphabetize = (product1, product2) => {
    return product1?.text?.localeCompare(product2?.text);
  };

  const productChoices = useMemo(
    () =>
      reposMap
        ? Object.keys(reposMap)
            .map((product) => ({
              text: reposMap[product].displayName,
              value: product,
            }))
            // Ensure invalid entries do not break selector
            .filter(({ text }) => text)
            //sort entries alphabetically by text
            .sort(alphabetize)
        : [],
    [reposMap]
  );

  const updateProduct = useCallback(({ value }) => {
    setProduct(value);
    setVersion('');
  }, []);

  const updateVersion = useCallback(({ value }) => setVersion(value), []);

  const versionChoices = useMemo(
    () =>
      reposMap[product]?.branches
        ? reposMap[product]?.branches
            .map((version) => {
              //only include versions with an eol_type field
              if (version.eol_type && version.versionSelectorLabel) {
                return {
                  text: prefixVersion(version.versionSelectorLabel),
                  value: version.versionSelectorLabel,
                  urlSlug: version.urlSlug,
                  icon: version.eol_type === 'download' ? <Icon glyph="Download" /> : null,
                };
              } else return null;
            })
            //Ensure versions set to null are not included and do not break selector
            .filter((versionChoice) => versionChoice)
            //sort versions newest(larger numbers) to oldest(smaller numbers). Assumes there are no more than three digits between/before/after each decimal place
            .sort(sortVersions)
        : [],
    [reposMap, product]
  );

  const versionChoicesMap = useMemo(() => keyBy(versionChoices, 'value'), [versionChoices]);

  const buttonDisabled = !(product && version && !isEmpty(reposMap));

  // Fetch docsets for url
  useEffect(() => {
    if (reposDatabase) {
      fetchDocsets(reposDatabase)
        .then((resp) => {
          const reposBranchesMap = keyBy(
            resp.filter((project) => project.hasEolVersions),
            'project'
          );
          if (!isEmpty(reposBranchesMap)) setReposMap(reposBranchesMap);
        })
        .catch((error) => {
          console.error(`ERROR: could not access ${reposDatabase} for dropdown data.`);
        });
    }
  }, [reposDatabase]);

  useEffect(() => {
    if (isBrowser) {
      // Extract the value of 'site' query string from the page url to pre-select product
      const { site } = queryString.parse(window.location.search);
      if (site && reposMap[site]) {
        setProduct(site);
      }
    }
  }, [reposMap]);

  const generateUrl = (currentVersion) => {
    if (!currentVersion) {
      return null;
    }

    // Utilizing hardcoded env or aws bucket path because legacy sites are not available on dev/stage
    if (currentVersion.icon) {
      const offlineURL = 'https://www.mongodb.com/docs/offline';
      return `${offlineURL}/${product}-${currentVersion.urlSlug}.tar.gz`;
    }
    if (hasValidHostName(reposMap[product])) {
      const hostName = reposMap[product].url.dotcomprd + reposMap[product].prefix.dotcomprd;
      return `${hostName}/${currentVersion.urlSlug}`;
    }
    console.error(`Invalid hostname, url could not be generated for ${currentVersion}`);
  };

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
        rightGlyph={versionChoicesMap[version]?.icon}
        href={generateUrl(versionChoicesMap[version])}
        disabled={buttonDisabled}
        className={cx(disabledStyle)}
      >
        {versionChoicesMap[version]?.icon ? 'Download Documentation' : 'View Documentation'}
      </Button>
    </>
  );
};

DeprecatedVersionSelector.propTypes = {};

export default DeprecatedVersionSelector;
