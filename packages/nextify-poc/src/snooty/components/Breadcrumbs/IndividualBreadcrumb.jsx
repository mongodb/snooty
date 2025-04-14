import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { css as LeafyCss, cx } from '@leafygreen-ui/emotion';
import Tooltip from '@leafygreen-ui/tooltip';
import Link from '../Link';
import { formatText } from '../../utils/format-text';
import { theme } from '../../theme/docsTheme';

const linkStyling = LeafyCss`
  font-size: ${theme.fontSize.small};
  vertical-align: middle;
  line-height: unset;
  // Important to overwrite GatsbyLink dark-theme font-weight
  font-weight: 400;

  :hover,
  :focus {
    text-decoration: underline;
  }
`;

const ellipsisStyling = LeafyCss`
  text-overflow: ellipsis;
`;

const linkWrapperLayoutStyling = LeafyCss`
  overflow: hidden;
  white-space: nowrap;

  :first-child {
    min-width: max-content;
  }

  @media ${theme.screenSize.smallAndUp} {
    :last-child {
      min-width: max-content;
    }
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

const TRUNCATION_THRESHOLD = 125; // px

const useIsTruncated = (node) => {
  const isTruncated = React.useSyncExternalStore(
    subscribeToResizeEvents,
    () => {
      const isTruncated = (node?.scrollWidth ?? 0) > (node?.clientWidth ?? 0);
      const isExcessivelyTruncated = isTruncated && node?.clientWidth <= TRUNCATION_THRESHOLD;

      // useSyncExternalStore requires types with value comparison semantics
      return JSON.stringify({ isTruncated, isExcessivelyTruncated });
    },
    getServerSnapshot
  );

  return JSON.parse(isTruncated);
};

const IndividualBreadcrumb = ({ crumb, setIsExcessivelyTruncated, onClick }) => {
  const [node, setNode] = useState(null);
  const measuredRef = useCallback((node) => {
    if (node !== null) {
      setNode(node);
    }
  }, []);

  const { isTruncated, isExcessivelyTruncated } = useIsTruncated(node);

  if (isExcessivelyTruncated) {
    setIsExcessivelyTruncated();
  }

  let result = (
    <div className={cx(linkWrapperLayoutStyling, crumb.title.length > 21 ? ellipsisStyling : '')} ref={measuredRef}>
      <Link className={cx(linkStyling)} to={crumb.path} onClick={onClick}>
        {formatText(crumb.title)}
      </Link>
    </div>
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
  path: PropTypes.string.isRequired,
};

IndividualBreadcrumb.propTypes = {
  crumb: PropTypes.shape(crumbObjectShape).isRequired,
  setIsExcessivelyTruncated: PropTypes.func.isRequired,
  onClick: PropTypes.func,
};

export default IndividualBreadcrumb;
