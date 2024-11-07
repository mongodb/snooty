import React from 'react';
import LeafyBanner from '@leafygreen-ui/banner';
import Link from '../Link';
import { baseBannerStyle } from './styles/bannerItemStyle';

const OfflineBanner = () => (
  <LeafyBanner className={baseBannerStyle} variant={'warning'}>
    You are viewing an offline version of MongoDB documentation. Some page features might be unavailable. To view the
    latest version of the page or use interactive features, visit the&nbsp;
    <Link to={'https://mongodb.com/docs'}>live page.</Link>
  </LeafyBanner>
);

export default OfflineBanner;
