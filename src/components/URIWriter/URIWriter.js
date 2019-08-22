import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { TEMPLATE_TYPE_ATLAS } from './constants';
import { TabContext } from '../tab-context';
import CloudForm from './CloudForm';
import LocalForm from './LocalForm';
import { getNestedValue } from '../../utils/get-nested-value';

const URIWriter = ({ handleUpdateURIWriter }) => {
  const { activeTabs } = useContext(TabContext);

  const handleUpdateURI = uriType => uri => {
    handleUpdateURIWriter({
      [uriType]: uri,
    });
  };

  const isAtlas = getNestedValue(['cloud'], activeTabs) === TEMPLATE_TYPE_ATLAS;

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
  handleUpdateURIWriter: PropTypes.func.isRequired,
};

export default URIWriter;
