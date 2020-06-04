const fs = require('fs');
const path = require('path');

const buildPath = template => path.resolve(`src/templates/${template}.js`);

// Returns the name of the template to be used based on the site, page name, and optional specified template.
const getTemplate = (site, page, template) => {
  const templatePath = buildPath(template);

  // If template is specified, ensure file exists and use
  if (fs.existsSync(templatePath)) {
    return templatePath;
  }

  let templateName;
  switch (site) {
    case 'guides':
      templateName = page === 'index' ? 'guides-index' : 'guide';
      break;
    case 'drivers':
      templateName = page === 'index' ? 'ecosystem-index' : 'document';
      break;
    default:
      templateName = 'document';
  }
  return buildPath(templateName);
};

module.exports.getTemplate = getTemplate;
