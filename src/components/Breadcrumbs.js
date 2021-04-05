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

  & > p {
    margin-top: 0;
  }
`;

const Breadcrumbs = ({ parentPaths, siteTitle }) => {
  if (!parentPaths) {
    return null;
  }

  return (
    <>
      <BreadcrumbSchema breadcrumb={parentPaths} siteTitle={siteTitle} />
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
    </>
  );
};

Breadcrumbs.propTypes = {
  parentPaths: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string,
      plaintext: PropTypes.string,
      title: PropTypes.arrayOf(PropTypes.object),
    })
  ),
  siteTitle: PropTypes.string.isRequired,
};

export default Breadcrumbs;
