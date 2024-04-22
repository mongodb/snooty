import React from 'react';
import PropTypes from 'prop-types';
import { css as LeafyCss, cx } from '@leafygreen-ui/emotion';
import Tooltip from '@leafygreen-ui/tooltip';
import Link from '../Link';
import { formatText } from '../../utils/format-text';
import { theme } from '../../theme/docsTheme';

function nodesToString(titleNodes) {
  if (typeof titleNodes === 'string') {
    return titleNodes;
  }

  return titleNodes
    .map((node) => {
      if (node.type === 'text') {
        return node.value;
      }

      return nodesToString(node.children);
    })
    .join('');
}

const linkStyling = LeafyCss`
  font-size: ${theme.fontSize.small};

  :hover,
  :focus {
    text-decoration: none;
  }
`;

// This should be graphemes using the Intl.Segmenter API, but browser support is too new
// at time of writing. For now, this is in code points. Which is wrong. But fast and easy.
const MAX_CRUMB_LENGTH = 21;

const IndividualBreadcrumb = ({ crumb, onClick }) => {
  let titleString = React.useMemo(() => nodesToString(crumb.title), [crumb]);

  let maybeTruncatedTitle = titleString;
  let truncated = false;

  if (maybeTruncatedTitle.length > MAX_CRUMB_LENGTH) {
    maybeTruncatedTitle = maybeTruncatedTitle.substr(0, MAX_CRUMB_LENGTH - 1) + '…';
    truncated = true;
  }

  let result = (
    <Link className={cx(linkStyling)} to={crumb.url} onClick={onClick}>
      {formatText(maybeTruncatedTitle)}
    </Link>
  );

  if (truncated) {
    result = (
      <Tooltip
        // To get the tooltip above the topnav we have to pop up the z-index
        popoverZIndex={9001}
        baseFontSize={13}
        triggerEvent="hover"
        open={true}
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
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

IndividualBreadcrumb.propTypes = {
  crumb: PropTypes.shape(crumbObjectShape).isRequired,
  onClick: PropTypes.func,
};

export default IndividualBreadcrumb;
