import React from 'react';
import PropTypes from 'prop-types';
import LeafyBanner from '@leafygreen-ui/banner';
import { cx } from '@leafygreen-ui/emotion';
import Link from '../Link';
import { assertTrailingSlash } from '../../utils/assert-trailing-slash';
import { baseBannerStyle, offlineBannerStyle, offlineBannerContainerStyle } from './styles/bannerItemStyle';

const OfflineBanner = ({ linkUrl = 'https://mongodb.com/docs/', template = 'document' }) => {
  return (
    <div className={cx(offlineBannerContainerStyle({ template }))}>
      <LeafyBanner className={cx(baseBannerStyle, offlineBannerStyle({ template }))} variant={'warning'}>
        You are viewing an offline version of MongoDB documentation. Some page features might be unavailable. To view
        the latest version of the page or use interactive features, visit the&nbsp;
        <Link to={assertTrailingSlash(linkUrl)}>live page.</Link>
      </LeafyBanner>
    </div>
  );
};

OfflineBanner.propTypes = {
  linkUrl: PropTypes.string,
};

export default OfflineBanner;
