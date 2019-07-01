import React from 'react';
import PropTypes from 'prop-types';
import CardPills from './CardPills';
import { getNestedValue } from '../../utils/get-nested-value';

const Card = ({ card, pageMetadata, time }) => {
  const getCardTitle = cardSlug => getNestedValue([cardSlug, 'title'], pageMetadata);

  const getPills = cardSlug => getNestedValue([cardSlug, 'languages'], pageMetadata);

  const cardContent = () => {
    const cardSlug = getNestedValue(['argument', 0, 'value'], card);
    const languagesNode = card.name !== 'multi-card' ? getPills(cardSlug) : undefined;
    const multiCardEntries = getNestedValue(['children', 0, 'children'], card);
    const innerContent = (
      <React.Fragment>
        <div className="guide__title">{card.name === 'card' ? getCardTitle(cardSlug) : cardSlug}</div>
        {card.name === 'multi-card' ? (
          <ul className="guide__body">
            {multiCardEntries.length > 0 &&
              multiCardEntries.map((listItem, index) => (
                <li className="guide__entry" key={index}>
                  <a href={getNestedValue(['children', 0, 'children', 0, 'value'], listItem)}>
                    {getCardTitle(getNestedValue(['children', 0, 'children', 0, 'value'], listItem))}
                  </a>
                </li>
              ))}
          </ul>
        ) : (
          <div className="guide__body" />
        )}
        {card.name !== 'multi-card' && languagesNode && <CardPills pillsNode={languagesNode} pillsetName="drivers" />}
        {card.name === 'card' && <div className="guide__time">{time}min</div>}
      </React.Fragment>
    );
    if (card.name === 'multi-card') {
      return <div className="guide guide--jumbo guide--expanded">{innerContent}</div>;
    }
    return (
      <a href={getNestedValue(['argument', 0, 'value'], card)} className="guide guide--regular">
        {innerContent}
      </a>
    );
  };

  return cardContent();
};

Card.propTypes = {
  card: PropTypes.shape({
    argument: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
      })
    ),
    children: PropTypes.arrayOf(
      PropTypes.shape({
        children: PropTypes.array,
      })
    ),
    name: PropTypes.string.isRequired,
  }).isRequired,
  time: PropTypes.string,
};

Card.defaultProps = {
  refDoc: undefined,
  time: undefined,
};

export default Card;
