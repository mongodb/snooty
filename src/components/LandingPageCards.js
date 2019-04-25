import React from 'react';
import PropTypes from 'prop-types';
import Card from './Card';
import { findKeyValuePair } from '../util';

const DEFAULT_COMPLETION_TIME = 15;
const CATEGORIES = [
  {
    name: 'Getting Started',
    iconSlug: 'getting-started',
  },
  {
    name: 'Use Case',
    iconSlug: 'use-case',
  },
  {
    name: 'Deep Dive',
    iconSlug: 'deep-dive',
  },
];

const Category = ({ cards, category, refDocMapping }) => {
  const getCardCompletionTime = cardSlug =>
    findKeyValuePair(refDocMapping[cardSlug].ast.children, 'name', 'time').argument[0].value || DEFAULT_COMPLETION_TIME;

  return (
    cards.length > 0 && (
      <section className="guide-category" key={category.iconSlug}>
        <div className={`guide-category__title guide-category__title--${category.iconSlug}`}>{category.name}</div>
        <div className="guide-category__guides">
          {cards.map((card, index) => {
            let completionTime;
            if (card.name === 'card') {
              const cardSlug = card.argument[0].value;
              completionTime = getCardCompletionTime(cardSlug);
            }
            return <Card card={card} key={index} refDocMapping={refDocMapping} time={completionTime} />;
          })}
        </div>
      </section>
    )
  );
};

const LandingPageCards = ({ guides, refDocMapping }) =>
  CATEGORIES.map(category => (
    <Category
      cards={guides.filter(card => {
        const cardName =
          card.name === 'card' ? card.argument[0].value : card.children[0].children[0].children[0].children[0].value;
        return (
          category.name === findKeyValuePair(refDocMapping[cardName].ast.children, 'name', 'category').argument[0].value
        );
      })}
      category={category}
      refDocMapping={refDocMapping}
      key={category.iconSlug}
    />
  ));

Category.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.object),
  category: PropTypes.shape({
    name: PropTypes.string.isRequired,
    iconSlug: PropTypes.string.isRequired,
  }).isRequired,
  refDocMapping: PropTypes.shape({
    index: PropTypes.shape({
      ast: PropTypes.object,
    }).isRequired,
  }).isRequired,
};

Category.defaultProps = {
  cards: [],
};

LandingPageCards.propTypes = {
  guides: PropTypes.arrayOf(
    PropTypes.shape({
      argument: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.string,
        })
      ),
      children: PropTypes.array,
      name: PropTypes.string,
    })
  ),
  refDocMapping: PropTypes.shape({
    index: PropTypes.shape({
      ast: PropTypes.object,
    }).isRequired,
  }).isRequired,
};

LandingPageCards.defaultProps = {
  guides: [],
};

export default LandingPageCards;
