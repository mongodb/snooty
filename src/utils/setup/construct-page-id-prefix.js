// Concatenates a site prefix to return a page id
const constructPageIdPrefix = ({ parserUser, parserBranch }) =>
  `${process.env.GATSBY_SITE}/${parserUser}/${parserBranch}`;

module.exports = { constructPageIdPrefix };
