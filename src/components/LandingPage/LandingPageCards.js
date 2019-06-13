import React from 'react';
import PropTypes from 'prop-types';
import Card from './Card';
import { findKeyValuePair } from '../../utils/find-key-value-pair';
import { getNestedValue } from '../../utils/get-nested-value';

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
    getNestedValue(
      ['argument', 0, 'value'],
      findKeyValuePair(getNestedValue([cardSlug, 'ast', 'children'], refDocMapping), 'name', 'time')
    ) || DEFAULT_COMPLETION_TIME;

  const columnSeparatedCards = [[], [], []];
  const lastRow = [];

  // create 3 sets of columns with cards
  cards.forEach((card, index) => {
    const modIndex = index % columnSeparatedCards.length;
    columnSeparatedCards[modIndex].push(card);
  });

  // separate out last row so we can sort it
  columnSeparatedCards.forEach(cardColumn => {
    if (cardColumn.length > 0) {
      lastRow.push(cardColumn[cardColumn.length - 1]);
    }
  });

  // sort last row by largest height
  lastRow.sort(a => {
    if (a && a.name === 'multi-card') {
      return -1;
    }
    return 1;
  });

  // replace last row
  lastRow.forEach((card, index) => {
    columnSeparatedCards[index].pop();
    columnSeparatedCards[index].push(card);
  });

  return (
    cards.length > 0 && (
      <section className="guide-category" key={category.iconSlug}>
        <div className={`guide-category__title guide-category__title--${category.iconSlug}`}>{category.name}</div>
        <div className="guide-category__guides">
          {columnSeparatedCards.map((cardColumn, indexColumn) => {
            return (
              <div className="guide-column" key={indexColumn}>
                {cardColumn.map((card, index) => {
                  let completionTime;
                  if (card.name === 'card') {
                    const cardSlug = getNestedValue(['argument', 0, 'value'], card);
                    completionTime = getCardCompletionTime(cardSlug);
                  }
                  return <Card card={card} key={index} refDocMapping={refDocMapping} time={completionTime} />;
                })}
              </div>
            );
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
          card.name === 'card'
            ? getNestedValue(['argument', 0, 'value'], card)
            : getNestedValue(['children', 0, 'children', 0, 'children', 0, 'children', 0, 'value'], card);
        return (
          category.name ===
          getNestedValue(
            ['argument', 0, 'value'],
            findKeyValuePair(getNestedValue([cardName, 'ast', 'children'], refDocMapping), 'name', 'category')
          )
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
