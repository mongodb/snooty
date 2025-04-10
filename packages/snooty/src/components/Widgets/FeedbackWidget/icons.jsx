import React from 'react';

export const FontAwesomeIcon = ({ icon, size, spin, ...props }) => {
  const classes = [`fa`, `fa-${icon}`, `fa-${size}`];
  if (spin) {
    classes.push(`fa-spin`);
  }
  return <div className={classes.join(' ')} {...props} />;
};

export const CameraIcon = (props) => <FontAwesomeIcon icon="camera" {...props} />;

export const SpinnerIcon = (props) => <FontAwesomeIcon icon="spinner" spin {...props} />;

export const CheckIcon = (props) => <FontAwesomeIcon icon="check" {...props} />;

export const StarIcon = (props) => <FontAwesomeIcon icon="star" {...props} />;
