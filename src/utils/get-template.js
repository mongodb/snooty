// Returns the name of the template to be used based on the site and page name.
<<<<<<< HEAD
const getTemplate = (page, site) => {
  let template = 'document';
  if (site === 'guides') {
=======
const getTemplate = page => {
  let template = 'document';
  if (process.env.GATSBY_SITE === 'guides') {
>>>>>>> Create getTemplate util function
    template = page === 'index' ? 'guides-index' : 'guide';
  }
  return template;
};

module.exports.getTemplate = getTemplate;
