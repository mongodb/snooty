import React from 'react';
import PropTypes from 'prop-types';
import { withPrefix } from 'gatsby';

const Card = ({ cardid, headline, image, link, type }) => (
  <a href={link} className={`card card-${type}`} id="cardid">
    <div className="card-image">
      <img alt={image} src={withPrefix(image)} />
    </div>
    <div className="card-content">
      <div className="card-headline">{headline}</div>
    </div>
  </a>
);

const CardGroup = ({ nodeData }) => {
  console.log(nodeData);
  const {
    options: { type },
  } = nodeData;
  return (
    <div className="card_group">
      {nodeData.children.map((child, index) => {
        return <Card key={index} type={type} {...child.options} />;
      })}
    </div>
  );
};

export default CardGroup;
