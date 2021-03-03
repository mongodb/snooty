import React, { useState } from 'react';
import PropTypes from 'prop-types';

const FreeformQuestion = ({ errorText, hasError, placeholder, store }) => {
  const [error, setError] = useState(false);
  const [text, setText] = useState('');

  const handleChange = (ev) => {
    const value = ev.target.value;
    const inputHasError = hasError(value);

    if (inputHasError) {
      store.set('');
      ev.target.setCustomValidity(inputHasError);
    } else {
      store.set(value);
      ev.target.setCustomValidity('');
    }
    setError(inputHasError);
    setText(value);
  };

  return (
    <div>
      <textarea placeholder={placeholder} onChange={handleChange} value={text} />
      <div className="error" style={{ visibility: error ? 'visible' : 'hidden' }}>
        {errorText}
      </div>
    </div>
  );
};

FreeformQuestion.propTypes = {
  errorText: PropTypes.string,
  hasError: PropTypes.func,
  placeholder: PropTypes.string,
  store: PropTypes.objectOf(PropTypes.func).isRequired,
};

FreeformQuestion.defaultProps = {
  errorText: 'This input contains an error.',
  hasError: () => false,
  placeholder: '',
};

export default FreeformQuestion;
