import React from 'react';
import Card from './Card';

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

const LandingPageCards = ({ guides, refDocMapping }) => {
  return CATEGORIES.map((category, index) => (
    <Category
      cards={guides.filter(card => {
        const cardName =
          card.name === 'card' ? card.argument[0].value : card.children[0].children[0].children[0].children[0].value;
        return category.name === getGuideType(refDocMapping[cardName].ast);
      })}
      category={category}
      refDocMapping={refDocMapping}
      key={category.iconSlug}
    />
  ));
};

const Category = ({ cards, category, refDocMapping }) => {
  return (
    cards.length > 0 && (
      <section className="guide-category" key={category.iconSlug}>
        <div className={`guide-category__title guide-category__title--${category.iconSlug}`}>{category.name}</div>
        <div className="guide-category__guides">
          {cards.map((card, index) => (
            <Card card={card} key={index} cardId={index} refDocMapping={refDocMapping} />
          ))}
        </div>
      </section>
    )
  );
};

const getGuideType = node => {
  if (node.name === 'type') {
    return node.argument[0].value;
  }

  if (node.children) {
    for (const i in node.children) {
      const child = node.children[i];
      const result = getGuideType(child);

      if (result !== false) {
        return result;
      }
    }
  }

  return false;
};

export default LandingPageCards;
