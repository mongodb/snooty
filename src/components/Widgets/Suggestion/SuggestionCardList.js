import React from 'react';
import PropTypes from 'prop-types';

const addQueryParameters = (url, pageName) => {
  return `${url}?suggestor=${encodeURIComponent(pageName)}`;
};

const SuggestionCard = ({ pageName, suggestion }) => {
  const urlWithParams = addQueryParameters(suggestion.url, pageName);
  return (
    <div className="suggestion-card">
      <a href={urlWithParams}>
        <div>
          <h2>{suggestion.title}</h2>
          {suggestion.description && <p>{suggestion.description}</p>}
        </div>
      </a>
    </div>
  );
};

const EmptyCard = ({ handleDismissCard }) => (
  <div className="suggestion-card suggestion-close" onClick={() => handleDismissCard()} role="button" tabIndex={0}>
    <h2>This isn&#39;t what I was looking for</h2>
  </div>
);

const SuggestionCardList = ({ handleDismissCard, pageName, suggestions }) => {
  const suggestionCards = suggestions.map((suggestion) => (
    <SuggestionCard suggestion={suggestion} key={suggestion.url} pageName={pageName} />
  ));
  return (
    <div>
      {suggestionCards}
      <EmptyCard handleDismissCard={handleDismissCard} />
    </div>
  );
};

SuggestionCard.propTypes = {
  pageName: PropTypes.string.isRequired,
  suggestion: PropTypes.shape({
    description: PropTypes.string,
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

EmptyCard.propTypes = {
  handleDismissCard: PropTypes.func.isRequired,
};

SuggestionCardList.propTypes = {
  suggestions: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleDismissCard: PropTypes.func.isRequired,
  pageName: PropTypes.string.isRequired,
};

export default SuggestionCardList;
