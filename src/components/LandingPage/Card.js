import React from 'react';
import PropTypes from 'prop-types';
import CardPills from './CardPills';
import Link from '../Link';
import { getNestedValue } from '../../utils/get-nested-value';

const DEFAULT_COMPLETION_TIME = 15;

const Card = ({ card, guidesMetadata }) => {
  const getCardTitle = (cardSlug) => getNestedValue([cardSlug, 'title'], guidesMetadata);
  const getCompletionTime = (cardSlug) =>
    getNestedValue([cardSlug, 'completionTime'], guidesMetadata) || DEFAULT_COMPLETION_TIME;
  const getPills = (cardSlug) => getNestedValue([cardSlug, 'languages'], guidesMetadata);

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
                  <Link to={getNestedValue(['children', 0, 'children', 0, 'value'], listItem)}>
                    {getCardTitle(getNestedValue(['children', 0, 'children', 0, 'value'], listItem))}
                  </Link>
                </li>
              ))}
          </ul>
        ) : (
          <div className="guide__body" />
        )}
        {card.name !== 'multi-card' && languagesNode && <CardPills pillsNode={languagesNode} pillsetName="drivers" />}
        {card.name === 'card' && <div className="guide__time">{getCompletionTime(cardSlug)}min</div>}
      </React.Fragment>
    );
    if (card.name === 'multi-card') {
      return <div className="guide guide--jumbo guide--expanded">{innerContent}</div>;
    }
    return (
      <Link to={getNestedValue(['argument', 0, 'value'], card)} className="guide guide--regular">
        {innerContent}
      </Link>
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
};

Card.defaultProps = {
  refDoc: undefined,
  time: undefined,
};

export default Card;
