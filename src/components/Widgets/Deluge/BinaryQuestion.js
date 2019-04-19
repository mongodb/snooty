import React from 'react';
import PropTypes from 'prop-types';

export default function BinaryQuestion({ children, store }) {
  const value = store.get();
  const upvoteClass = value === true ? 'selected' : '';
  const downvoteClass = value === false ? 'selected' : '';

  return (
    <div>
      <div key="caption">{children}</div>
      <div key="question">
        <span className={`switch fa fa-thumbs-up good ${upvoteClass}`} onClick={() => store.set(true)} />
        <span className={`switch fa fa-thumbs-down bad ${downvoteClass}`} onClick={() => store.set(false)} />
      </div>
    </div>
  );
}

BinaryQuestion.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
  store: PropTypes.objectOf(PropTypes.func).isRequired,
};
