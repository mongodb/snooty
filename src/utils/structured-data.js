/**
 * Classes to construct Structured Data JSON.
 * Required props should be read in constructor function (to fail validity).
 * Optional props can be set conditionally.
 * Constant values should be set in the constructor function.
 * Optional overwrites can be set in params as default values
 */

export class StructuredData {
  isValid() {
    function recursiveValidity(param) {
      // array
      if (Array.isArray(param)) {
        return param.every((e) => recursiveValidity(e));
      }
      // object
      else if (param && typeof param === 'object') {
        return Object.keys(param).every((e) => {
          if (param.hasOwnProperty(e)) return recursiveValidity(param[e]);
          return true;
        });
      }

      // string or number
      return String(param).length > 0;
    }

    return recursiveValidity(this);
  }

  toString() {
    return JSON.stringify(this);
  }
}

export class TechArticleSd extends StructuredData {
  constructor({
    headline,
    mainEntity: {
      name,
      offers: { softwareVersion },
    },
    genre,
  }) {
    super();
    this.author = {
      '@type': 'Organization',
      name: 'MongoDB Documentation Team',
    };
    this.headline = headline;
    this.mainEntity = {
      type: 'SoftwareApplication',
      name, // TODO: make a class fn to verify name (prefixed with MongoDB if not already in the name)
      applicationCategory: 'DeveloperApplication',
      offers: { price: 0 },
    };
    if (genre) {
      this.genre = genre;
    }
    if (softwareVersion) {
      this.offers['softwareVersion'] = softwareVersion;
    }
  }
}
