import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TEMPLATE_TYPE_ATLAS } from './constants';
import CloudForm from './CloudForm';
import LocalForm from './LocalForm';

const URIWriter = ({ activeTabs: { cloud }, handleUpdateURIWriter }) => {
  const handleUpdateURI = uriType => uri => {
    handleUpdateURIWriter({
      [uriType]: uri,
    });
  };

  const isAtlas = cloud === TEMPLATE_TYPE_ATLAS;

  return (
    <form className="uriwriter__form" autoComplete="off">
      {isAtlas ? (
        <CloudForm handleUpdateURIWriter={handleUpdateURI('cloudURI')} />
      ) : (
        <LocalForm handleUpdateURIWriter={handleUpdateURI('localURI')} />
      )}
    </form>
  );
};

URIWriter.propTypes = {
  activeTabs: PropTypes.shape({
    cloud: PropTypes.string,
  }).isRequired,
  handleUpdateURIWriter: PropTypes.func.isRequired,
};

export default URIWriter;
