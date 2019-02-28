import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Card extends Component {
  getTitle(val) {
    const { refDocMapping } = this.props;
    if (refDocMapping[val] && refDocMapping[val].ast) {
      return refDocMapping[val].ast.children[0].children[0].children[0].value;
    }
    return 'Title not found';
  }

  cardContent() {
    const { card } = this.props;
    const innerContent = (
      <section style={{ height: '100%' }}>
        <div className="guide__title">
          {card.name === 'card' ? this.getTitle(card.argument[0].value) : card.argument[0].value}
        </div>
        <ul className="guide__body">
          {card.name === 'multi-card' &&
            card.children[0].children.map((listItem, index) => (
              <li className="guide__entry" key={index}>
                <a href={listItem.children[0].children[0].value}>
                  {this.getTitle(listItem.children[0].children[0].value)}
                </a>
              </li>
            ))}
        </ul>
        <ul className="guide__pills" />
        {/* TODO: display accurate time estimate for guide */}
        {card.name === 'card' && <div className="guide__time">{card.name === 'card' && '5min'}</div>}
      </section>
    );
    if (card.name === 'multi-card') {
      return <div className="guide guide--jumbo guide--expanded">{innerContent}</div>;
    }
    return (
      <a href={card.argument[0].value} className="guide guide--regular">
        {innerContent}
      </a>
    );
  }

  render() {
    return this.cardContent();
  }
}

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
  refDocMapping: PropTypes.shape({
    index: PropTypes.shape({
      ast: PropTypes.object,
    }).isRequired,
  }).isRequired,
};
