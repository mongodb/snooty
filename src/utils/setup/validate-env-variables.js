const fs = require('fs');

// env variables for building site along with use in front-end
// https://www.gatsbyjs.org/docs/environment-variables/#defining-environment-variables
const validateEnvVariables = (manifestMetadata) => {
  // only require env vars when no manifest path is specified
  if (
    !process.env.GATSBY_MANIFEST_PATH &&
    (!process.env.GATSBY_SITE || !process.env.GATSBY_PARSER_USER || !process.env.GATSBY_PARSER_BRANCH)
  ) {
    return {
      error: true,
      message: `${process.env.NODE_ENV} requires the variables GATSBY_SITE, GATSBY_PARSER_USER, and GATSBY_PARSER_BRANCH, found: ${process.env.GATSBY_SITE}, ${process.env.GATSBY_PARSER_USER}, ${process.env.GATSBY_PARSER_BRANCH}`,
    };
  } else if (process.env.GATSBY_MANIFEST_PATH) {
    validateManifestEnvVars(manifestMetadata);
  }
  // create split prefix for use in stitch function
  return {
    error: false,
  };
};

// set env vars accordingly if none are provided
const validateManifestEnvVars = (manifestMetadata) => {
  let envVars = '';
  const site = `\nGATSBY_SITE=${manifestMetadata['project']}`;
  const branch = `\nGATSBY_PARSER_BRANCH=${manifestMetadata['branch']}`;

  if (!process.env.GATSBY_SITE) {
    envVars += site;
  }
  if (!process.env.GATSBY_PARSER_BRANCH) {
    envVars += branch;
  }

  // write to .env files with updated env vars
  try {
    ['.env.production', '.env.development'].forEach((file) => {
      fs.appendFile(file, envVars, function (err) {
        if (err) {
          console.error(err);
          throw err;
        }
      });
    });
  } catch (err) {
    console.error(err);
    throw err;
  }

  // if env variables are present, check that they are set to the correct values. Otherwise, override them.
  let incorrectEnvVars = [];
  let correctEnvVars = '';
  if (process.env.GATSBY_SITE && process.env.GATSBY_SITE !== manifestMetadata['project']) {
    incorrectEnvVars.push('GATSBY_SITE');
    correctEnvVars += site;
  }
  if (process.env.GATSBY_PARSER_BRANCH && process.env.GATSBY_PARSER_BRANCH !== manifestMetadata['branch']) {
    incorrectEnvVars.push('GATSBY_PARSER_BRANCH');
    correctEnvVars += branch;
  }
  if (incorrectEnvVars.length > 0) {
    replaceIncorrectEnvVars(incorrectEnvVars, correctEnvVars);
  }
};

const replaceIncorrectEnvVars = (incorrectEnvVars, envVars) => {
  try {
    ['.env.production', '.env.development'].forEach((file) => {
      fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          throw err;
        }


        const dataArray = data.split('\n');
        console.log(data)

        // remove incorrect variables from .env files
        for (const dataEntry in dataArray) {
          for (const incorrectVar in incorrectEnvVars) {
            if (dataArray[dataEntry].includes(incorrectEnvVars[incorrectVar])) {
              dataArray.splice(dataEntry, 1);
            }
          }
        }

        // write to .env files with updated env vars
        fs.writeFile(file, dataArray.join('\n').concat(envVars), (err) => {
          if (err) {
            console.error(err);
            throw err;
          }
        });
      });
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports.validateEnvVariables = validateEnvVariables;
