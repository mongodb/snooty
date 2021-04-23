import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { uiColors } from '@leafygreen-ui/palette';
import { css } from '@emotion/core';
import Link from './Link';
import { SNOOTY_STITCH_ID } from '../build-constants';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import { theme } from '../theme/docsTheme';
import { formatText } from '../utils/format-text';
import { reportAnalytics } from '../utils/report-analytics';
import { fetchProjectParents } from '../utils/stitch';

const activeColor = css`
  color: ${uiColors.gray.dark3};
`;

const StyledNav = styled('nav')`
  font-size: ${theme.fontSize.small};
  min-height: ${theme.size.medium};

  * {
    color: ${uiColors.gray.dark1};
  }

  & > p {
    margin-top: 0;
  }
`;

const StyledArrow = styled('span')`
  cursor: default;

  :last-of-type {
    ${activeColor}
  }
`;

const StyledLink = styled(Link)`
  :last-of-type {
    ${activeColor}
  }

  :hover,
  :focus {
    text-decoration: none;

    :not(:last-of-type) {
      ${activeColor}
    }
  }
`;

const BreadcrumbContainer = ({ lastCrumb }) => {
  const { database, project } = useSiteMetadata();
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  useEffect(() => {
    const fetchBreadcrumbData = async () => {
      let parentCrumbs = await fetchProjectParents(SNOOTY_STITCH_ID, database, project);
      const breadcrumbs = [
        { title: 'Docs Home', url: project === 'landing' ? '/' : 'https://docs.mongodb.com/' },
        ...parentCrumbs,
        lastCrumb,
      ];
      setBreadcrumbs(breadcrumbs);
    };
    fetchBreadcrumbData();
  }, [database, lastCrumb, project]);

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <StyledNav>
      <p>
        {breadcrumbs.map(({ title, url }, index) => {
          const isFirst = index === 0;
          return (
            <React.Fragment key={title}>
              {!isFirst && <StyledArrow> &#8594; </StyledArrow>}
              <StyledLink
                to={url}
                onClick={() => {
                  reportAnalytics('BreadcrumbClick', {
                    parentPaths: breadcrumbs,
                    breadcrumbClicked: url,
                  });
                }}
              >
                {formatText(title)}
              </StyledLink>
            </React.Fragment>
          );
        })}
      </p>
    </StyledNav>
  );
};

BreadcrumbContainer.propTypes = {
  lastCrumb: PropTypes.shape({
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default BreadcrumbContainer;
