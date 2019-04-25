import React from 'react';
import PropTypes from 'prop-types';
import { findKeyValuePair } from '../util';
import { stringifyTab } from '../constants';
import { setLocalValue } from '../localStorage';

const CardPills = ({ isTruncated, pills, pillsetName }) => (
  <ul className="guide__pills">
    {pills.map((pill, index) => (
      <li className="guide__pill" key={index}>
        <span
          onClick={() => {
            setLocalValue(pillsetName, pill);
          }}
          role="button"
          tabIndex={index}
        >
          {stringifyTab(pill)}
        </span>
      </li>
    ))}
    {isTruncated && <li className="guide__pill guide__pill--seeall">See All</li>}
  </ul>
);

CardPills.propTypes = {
  isTruncated: PropTypes.bool,
  pills: PropTypes.arrayOf(PropTypes.string).isRequired,
  pillsetName: PropTypes.string.isRequired,
};

CardPills.defaultProps = {
  isTruncated: false,
};

const Card = ({ card, refDocMapping, time }) => {
  const getTitle = val => {
    if (refDocMapping[val] && refDocMapping[val].ast) {
      return refDocMapping[val].ast.children[0].children[0].children[0].value;
    }
    return 'Title not found';
  };

  const getPillTitle = node => {
    if (node.type !== 'listItem') {
      return '';
    }
    if (!node.children || !Array.isArray(node.children) || !node.children[0] || node.children[0].type !== 'paragraph') {
      return '';
    }
    if (
      !node.children[0].children ||
      !Array.isArray(node.children[0].children) ||
      !node.children[0].children[0] ||
      node.children[0].children[0].type !== 'text'
    ) {
      return '';
    }
    if (!node.children[0].children[0].value) {
      return '';
    }
    return node.children[0].children[0].value;
  };

  const getPills = cardSlug => {
    const languagesNode = findKeyValuePair(refDocMapping[cardSlug].ast.children, 'name', 'languages');
    if (languagesNode && languagesNode.children[0].type === 'list') {
      let totalLength = 0;
      let isTruncated = false;
      const languages = [];
      languagesNode.children[0].children.forEach(langObj => {
        const lang = getPillTitle(langObj);
        if (totalLength > 50) {
          isTruncated = true;
        } else {
          languages.push(lang);
        }
        totalLength += stringifyTab(lang).length + 4;
      });
      return [languages, isTruncated];
    }
    return [undefined, undefined];
  };

  const cardContent = () => {
    const cardSlug = card.argument[0].value;
    const [languages, isTruncated] = card.name !== 'multi-card' ? getPills(cardSlug) : [undefined, undefined];
    const innerContent = (
      <React.Fragment>
        <div className="guide__title">{card.name === 'card' ? getTitle(cardSlug) : cardSlug}</div>
        {card.name === 'multi-card' ? (
          <ul className="guide__body">
            {card.children[0].children.map((listItem, index) => (
              <li className="guide__entry" key={index}>
                <a href={listItem.children[0].children[0].value}>{getTitle(listItem.children[0].children[0].value)}</a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="guide__body" />
        )}
        {card.name !== 'multi-card' && languages && (
          <CardPills pills={languages} pillsetName="drivers" isTruncated={isTruncated} />
        )}
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

export default Card;
