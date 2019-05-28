import React from 'react';
import PropTypes from 'prop-types';

const BinaryQuestion = ({ children, store }) => {
  const value = store.get();
  const upvoteClass = value === true ? 'selected' : '';
  const downvoteClass = value === false ? 'selected' : '';

  return (
    <div>
      <div key="caption">{children}</div>
      <div key="question">
        <span
          className={`switch fa fa-thumbs-up good ${upvoteClass}`}
          onClick={() => store.set(true)}
          role="button"
          tabIndex={0}
        />
        <span
          className={`switch fa fa-thumbs-down bad ${downvoteClass}`}
          onClick={() => store.set(false)}
          role="button"
          tabIndex={0}
        />
      </div>
    </div>
  );
};

BinaryQuestion.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  store: PropTypes.objectOf(PropTypes.func).isRequired,
};

export default BinaryQuestion;
