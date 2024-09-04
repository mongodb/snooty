import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@leafygreen-ui/emotion';
import { getPlaintext } from '../utils/get-plaintext';
import { usePageContext } from '../context/page-context';
import { theme } from '../theme/docsTheme';
import Overline from './Internal/Overline';
import { MPTNextLinkMini } from './MultiPageTutorials';

const timeBaseStyle = css`
  font-weight: 600;
  line-height: ${theme.size.default};
  margin-top: 40px;
  margin-bottom: ${theme.size.default};
`;

const Time = ({ nodeData: { argument } }) => {
  const { template } = usePageContext();

  const time = getPlaintext(argument);
  if (!time) {
    return null;
  }

  if (template === 'guide') {
    return (
      <p>
        <em>Time required: {time} minutes</em>
      </p>
    );
  }

  return (
    <>
      <MPTNextLinkMini />
      <Overline className={timeBaseStyle}>Read time {time} min</Overline>
    </>
  );
};

Time.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default Time;
