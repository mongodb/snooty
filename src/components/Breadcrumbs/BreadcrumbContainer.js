import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { css as LeafyCss, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import Link from '../Link';
import { NavigationContext } from '../../context/navigation-context';
import { formatText } from '../../utils/format-text';
import { theme } from '../../theme/docsTheme';
import { reportAnalytics } from '../../utils/report-analytics';

const activeColor = css`
  color: ${palette.gray.dark3};
`;

const StyledArrow = styled('span')`
  cursor: default;

  :last-of-type {
    ${activeColor}
  }
`;

const linkStyling = LeafyCss`
  font-size: ${theme.fontSize.small};
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

const BreadcrumbContainer = ({ homeCrumb, lastCrumb }) => {
  const { parents } = useContext(NavigationContext);
  const breadcrumbs = React.useMemo(() => [homeCrumb, ...parents, lastCrumb], [homeCrumb, parents, lastCrumb]);

  return (
    <>
      {breadcrumbs.map(({ title, url }, index) => {
        const isFirst = index === 0;
        return (
          <React.Fragment key={title}>
            {!isFirst && <StyledArrow> &#8594; </StyledArrow>}
            <Link
              className={cx(linkStyling)}
              to={url}
              onClick={() => {
                reportAnalytics('BreadcrumbClick', {
                  parentPaths: breadcrumbs,
                  breadcrumbClicked: url,
                });
              }}
            >
              {formatText(title)}
            </Link>
          </React.Fragment>
        );
      })}
    </>
  );
};

const crumbObjectShape = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

BreadcrumbContainer.propTypes = {
  homeCrumb: PropTypes.shape(crumbObjectShape).isRequired,
  lastCrumb: PropTypes.shape(crumbObjectShape).isRequired,
};

export default BreadcrumbContainer;
