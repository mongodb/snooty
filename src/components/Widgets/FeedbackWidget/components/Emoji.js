const Emoji = ({ sentiment }) => {
  switch (sentiment) {
    case 'positive':
      return '🙂  ';
    case 'negative':
      return '😞  ';
    case 'suggestion':
      return '💡  ';
    default:
      return 'noemoji  ';
  }
};

export default Emoji;
