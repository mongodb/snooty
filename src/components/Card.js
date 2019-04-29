import React from 'react';
import PropTypes from 'prop-types';
import { findKeyValuePair } from '../util';
import { stringifyTab } from '../constants';
import { setLocalValue } from '../localStorage';

const CardPills = ({ pillsNode, pillsetName }) => {
  const getPillTitle = node => node.children[0].children[0].value;

  // Get the name of each pill. If the total character length of pills > 50, truncate them and add a "See All" pill.
  const mapPills = node => {
    let totalLength = 0;
    let isTruncated = false;
    const pills = [];
    node.children[0].children.forEach(pillObj => {
      const pill = getPillTitle(pillObj);
      if (totalLength > 50) {
        isTruncated = true;
      } else {
        pills.push(pill);
      }
      totalLength += stringifyTab(pill).length + 4;
    });
    return [pills, isTruncated];
  };

  const [pills, isTruncated] = mapPills(pillsNode);

  return (
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
};

CardPills.propTypes = {
  pillsetName: PropTypes.string.isRequired,
  pillsNode: PropTypes.shape({
    name: PropTypes.oneOf(['languages']).isRequired,
    children: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.oneOf(['list']).isRequired,
        children: PropTypes.arrayOf(
          PropTypes.shape({
            type: PropTypes.oneOf(['listItem']).isRequired,
            children: PropTypes.arrayOf(
              PropTypes.shape({
                type: PropTypes.oneOf(['paragraph']).isRequired,
                children: PropTypes.arrayOf(
                  PropTypes.shape({
                    type: PropTypes.oneOf(['text']).isRequired,
                    value: PropTypes.string.isRequired,
                  })
                ).isRequired,
              })
            ).isRequired,
          })
        ).isRequired,
      })
    ).isRequired,
  }).isRequired,
};

const Card = ({ card, refDocMapping, time }) => {
  const getCardTitle = cardSlug => {
    if (refDocMapping[cardSlug].ast) {
      return refDocMapping[cardSlug].ast.children[0].children[0].children[0].value;
    }
    return 'Title not found';
  };

  const getPills = cardSlug => {
    return findKeyValuePair(refDocMapping[cardSlug].ast.children, 'name', 'languages');
  };

  const cardContent = () => {
    const cardSlug = card.argument[0].value;
    const languagesNode = card.name !== 'multi-card' ? getPills(cardSlug) : undefined;
    const innerContent = (
      <React.Fragment>
        <div className="guide__title">{card.name === 'card' ? getCardTitle(cardSlug) : cardSlug}</div>
        {card.name === 'multi-card' ? (
          <ul className="guide__body">
            {card.children[0].children.map((listItem, index) => (
              <li className="guide__entry" key={index}>
                <a href={listItem.children[0].children[0].value}>
                  {getCardTitle(listItem.children[0].children[0].value)}
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
  refDocMapping: PropTypes.oneOfType([
    PropTypes.shape({
      index: PropTypes.shape({
        ast: PropTypes.object,
      }).isRequired,
    }),
    PropTypes.shape({
      [PropTypes.string]: PropTypes.shape({
        ast: PropTypes.object.isRequired,
      }).isRequired,
    }).isRequired,
  ]),
  time: PropTypes.string,
};

Card.defaultProps = {
  refDoc: undefined,
  time: undefined,
};

export default Card;

/* 
    [PropTypes.string]: PropTypes.shape({
      ast: PropTypes.shape({
        children: PropTypes.arrayOf(
          PropTypes.shape({
            children: PropTypes.arrayOf(
              PropTypes.shape({
                children: PropTypes.arrayOf(
                  PropTypes.shape({
                    value: PropTypes.string.isRequired,
                  })
                ).isRequired,
              })
            ).isRequired,
          })
        ).isRequired,
      }).isRequired,
    }).isRequired, */
