import React from 'react';

const Instruqt = ({ nodeData: { argument }, nodeData }) => {
  const embedValue = argument[0].value;

  if (!embedValue) {
    return null;
  }

  return (
    <iframe
      allowFullScreen
      sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
      title={`Instruqt ${embedValue}`}
      height="640"
      width="100%"
      src={`https://play.instruqt.com/embed${embedValue}`}
    />
  );
};

export default Instruqt;
