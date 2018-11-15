import React from 'react';

function CommentForm({ handleSubmit, handleChange, placeholder }) {
  const formStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%'
  };

  const inputStyle = {
    backgroundColor: 'hsla(0,0%,100%,0.125)',
    border: '0',
    borderRadius: '4px',
    boxShadow: 'none',
    color: '#fff',
    flexGrow: 1,
    padding: '0.5rem',
    resize: 'none'
  };

  const buttonStyle = {
    backgroundColor: 'hsla(0,0%,100%,0.75)',
    border: 0,
    borderRadius: '4px',
    float: 'right',
    height: '100%',
    marginLeft: '0.5rem',
    padding: '0.5rem',
    position: 'relative',
    zIndex: '1254'
  };

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit} style={formStyle}>
        <textarea placeholder={placeholder} style={inputStyle} onChange={handleChange}></textarea>
        <input style={buttonStyle} type="submit" value="Submit" />
      </form>
    </React.Fragment>
  );
}

export default CommentForm;
