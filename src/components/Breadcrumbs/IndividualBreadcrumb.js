import React from 'react';
import PropTypes from 'prop-types';
import { css as LeafyCss, cx } from '@leafygreen-ui/emotion';
import Tooltip from '@leafygreen-ui/tooltip';
import Link from '../Link';
import { formatText } from '../../utils/format-text';
import { theme } from '../../theme/docsTheme';

const linkStyling = LeafyCss`
  font-size: ${theme.fontSize.small};

  :hover,
  :focus {
    text-decoration: none;
  }
`;

const linkWrapperLayoutStyling = LeafyCss`
  text-overflow: ellipsis;
  overflow: hidden;
  text-wrap: nowrap;

  :first-child, :last-child {
    min-width: max-content;
  }
`;

// On resize events, recheck if our truncation status
function subscribeToResizeEvents(callback) {
  window.addEventListener('resize', callback);
  return () => {
    window.removeEventListener('resize', callback);
  };
}

// For server-side generation, assume no truncation
function getServerSnapshot() {
  return false;
}

const useIsTruncated = (ref) => {
  const isTruncated = React.useSyncExternalStore(
    subscribeToResizeEvents,
    () => (ref.current?.scrollWidth ?? 0) > (ref.current?.clientWidth ?? 0),
    getServerSnapshot
  );

  return isTruncated;
};

const IndividualBreadcrumb = ({ crumb, onClick }) => {
  const linkRef = React.useRef();
  const isTruncated = useIsTruncated(linkRef);

  let result = (
    <span className={cx(linkWrapperLayoutStyling)} ref={linkRef}>
      <Link className={cx(linkStyling)} to={crumb.url} onClick={onClick}>
        {formatText(crumb.title)}
      </Link>
    </span>
  );

  if (isTruncated) {
    result = (
      <Tooltip
        // To get the tooltip above the topnav we have to pop up the z-index
        popoverZIndex={9001}
        baseFontSize={13}
        triggerEvent="hover"
        align="top"
        justify="middle"
        trigger={result}
      >
        {formatText(crumb.title)}
      </Tooltip>
    );
  }

  return result;
};

const crumbObjectShape = {
  title: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.arrayOf(PropTypes.object)]),
  url: PropTypes.string.isRequired,
};

IndividualBreadcrumb.propTypes = {
  crumb: PropTypes.shape(crumbObjectShape).isRequired,
  onClick: PropTypes.func,
};

export default IndividualBreadcrumb;
