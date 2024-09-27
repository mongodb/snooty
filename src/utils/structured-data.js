/**
 * Classes to construct Structured Data JSON.
 * Required props should be read in constructor function (to fail validity).
 * Optional props can be set conditionally.
 * Constant values should be set in the constructor function.
 * Optional overwrites can be set in params as default values
 */

import { getFullLanguageName } from './get-language';

export class StructuredData {
  constructor(type) {
    this['@context'] = 'https://schema.org';
    this['@type'] = type;
  }

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

  static addCompanyToName(name) {
    if (!name) {
      return name;
    }
    if (Array.isArray(name)) {
      return name.map(this.addCompanyToName);
    }
    if (name.toLowerCase().includes('mongodb')) {
      return name;
    }
    return `MongoDB ` + name;
  }
}

export class SoftwareSourceCodeSd extends StructuredData {
  constructor({ code, lang }) {
    super('SoftwareSourceCode');
    this.codeSampleType = 'code snippet';
    this.programmingLanguage = getFullLanguageName(lang);
    this.text = code;
  }
}
