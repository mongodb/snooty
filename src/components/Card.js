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
    const { card, time } = this.props;
    const innerContent = (
      <React.Fragment>
        <div className="guide__title">
          {card.name === 'card' ? this.getTitle(card.argument[0].value) : card.argument[0].value}
        </div>
        {card.name === 'multi-card' ? (
          <ul className="guide__body">
            {card.children[0].children.map((listItem, index) => (
              <li className="guide__entry" key={index}>
                <a href={listItem.children[0].children[0].value}>
                  {this.getTitle(listItem.children[0].children[0].value)}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="guide__body" />
        )}
        <ul className="guide__pills" />
        {card.name === 'card' && <div className="guide__time">{time} min</div>}
      </React.Fragment>
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
  time: PropTypes.string,
};

Card.defaultProps = {
  time: undefined,
};
