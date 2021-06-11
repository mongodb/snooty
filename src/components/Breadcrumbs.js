import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import BreadcrumbSchema from './BreadcrumbSchema';
import ComponentFactory from './ComponentFactory';
import Link from './Link';
import { reportAnalytics } from '../utils/report-analytics';
import { theme } from '../theme/docsTheme';

const BreadcrumbContainer = styled('nav')`
  font-size: ${theme.fontSize.small};
  ${theme.bannerContent.enabled && `margin-top: ${theme.navbar.bannerHeight.small};`}

  @media ${theme.screenSize.upToMedium} {
    ${theme.bannerContent.enabled && `margin-top: ${theme.navbar.bannerHeight.medium};`}
  }

  @media not all and (max-width: 1600px) {
    ${theme.bannerContent.enabled && `margin-top: ${theme.navbar.bannerHeight.large};`}
  }

  & > p {
    margin-top: 0;
  }
`;

const Breadcrumbs = ({ parentPaths, siteTitle, slug }) => (
  <>
    <BreadcrumbSchema breadcrumb={parentPaths} siteTitle={siteTitle} slug={slug} />
    {parentPaths && (
      <BreadcrumbContainer>
        <p>
          {parentPaths.map(({ path, plaintext, title }, index) => {
            const isLast = index === parentPaths.length - 1;
            return (
              <React.Fragment key={path}>
                <Link
                  to={path}
                  onClick={() => {
                    reportAnalytics('BreadcrumbClick', {
                      parentPaths: parentPaths,
                      breadcrumbClicked: path,
                    });
                  }}
                >
                  {title.map((t, i) => (
                    <ComponentFactory key={i} nodeData={t} />
                  ))}
                </Link>
                {!isLast && <> &gt; </>}
              </React.Fragment>
            );
          })}
        </p>
      </BreadcrumbContainer>
    )}
  </>
);

Breadcrumbs.propTypes = {
  parentPaths: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string,
      plaintext: PropTypes.string,
      title: PropTypes.arrayOf(PropTypes.object),
    })
  ),
  siteTitle: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
};

export default Breadcrumbs;
