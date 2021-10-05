import React from 'react';
import PropTypes from 'prop-types';
import Breadcrumbs from '../components/Breadcrumbs';
import MainColumn from '../components/MainColumn';
import DriversIndexStyles from '../styles/drivers-index.module.css';

const DriversIndex = ({
  children,
  pageContext: {
    metadata: { title, parentPaths },
    slug,
  },
}) => (
  <div>
    <MainColumn className={DriversIndexStyles.fullWidth}>
      <div className="body">
        <Breadcrumbs parentPaths={parentPaths.slug} siteTitle={title} slug={slug} />
        {children}
      </div>
    </MainColumn>
  </div>
);

DriversIndex.propTypes = {
  pageContext: PropTypes.shape({
    metadata: PropTypes.shape({
      title: PropTypes.string.isRequired,
      parentPaths: PropTypes.object,
    }),
    slug: PropTypes.string.isRequired,
  }).isRequired,
};

export default DriversIndex;
