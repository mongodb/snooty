import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Input = props => <input {...props} />;

const Textarea = props => <textarea {...props} />;

const FormWithError = ({ children, errorText, hasError, placeholder, store }) => {
  const [error, setError] = useState(false);
  const [text, setText] = useState('');

  const handleChange = ev => {
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
      {children}
      <textarea placeholder={placeholder} onInput={handleChange} value={text} />
      <div className="error" style={{ visibility: error ? 'visible' : 'hidden' }}>
        {errorText}
      </div>
    </div>
  );
};

FormWithError.propTypes = {
  errorText: PropTypes.string,
  hasError: PropTypes.func,
  placeholder: PropTypes.string,
  store: PropTypes.objectOf(PropTypes.func).isRequired,
};

FormWithError.defaultProps = {
  errorText: 'This input contains an error.',
  hasError: () => false,
  placeholder: '',
};

export default FormWithError;
