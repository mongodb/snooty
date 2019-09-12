import React from 'react';
import PropTypes from 'prop-types';
import { withPrefix } from 'gatsby';
import { getNestedValue } from '../utils/get-nested-value';

const Card = ({ cardid, headline, image, link, type }) => (
  <a href={link} className={`card card-${type}`} id={cardid}>
    <div className="card-image">
      <img src={withPrefix(image)} alt={cardid} />
    </div>
    <div className="card-content">
      <div className="card-headline">{headline}</div>
    </div>
  </a>
);

Card.propTypes = {
  cardid: PropTypes.string.isRequired,
  headline: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

const CardGroup = ({ nodeData }) => {
  const type = getNestedValue(['options', 'type'], nodeData);
  return (
    <div className="card_group">
      {nodeData.children.map((child, index) => (
        <Card key={index} type={type} {...child.options} />
      ))}
    </div>
  );
};

CardGroup.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
    options: PropTypes.shape({
      type: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default CardGroup;
