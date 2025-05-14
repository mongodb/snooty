/**
 * Classes to construct Structured Data JSON.
 * Required props should be read in constructor function (to fail validity).
 * Optional props can be set conditionally.
 * Constant values should be set in the constructor function.
 * Optional overwrites can be set in params as default values
 */

import sanitize from 'sanitize-html';
import { getFullLanguageName } from './get-language';
import { findKeyValuePair } from './find-key-value-pair';
import { getPlaintext } from './get-plaintext';
import { getCompleteBreadcrumbData, getFullBreadcrumbPath } from './get-complete-breadcrumb-data';

// Class name to help Smartling identify all structured data, if needed
export const STRUCTURED_DATA_CLASSNAME = 'structured_data';

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

export class BreadcrumbListSd extends StructuredData {
  constructor({ siteUrl, siteTitle, slug, queriedCrumbs, parentPaths }) {
    super('BreadcrumbList');
    const breadcrumbs = getCompleteBreadcrumbData({ siteUrl, siteTitle, slug, queriedCrumbs, parentPaths });
    this.itemListElement = this.getBreadcrumbList(breadcrumbs, siteUrl);
  }

  /**
   * @param {object[]} breadcrumbs
   * @param {string} siteUrl
   */
  getBreadcrumbList(breadcrumbs, siteUrl) {
    return breadcrumbs.map(({ path, title }, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: title,
      item: getFullBreadcrumbPath(siteUrl, path, true),
    }));
  }
}

class HowToSd extends StructuredData {
  constructor({ steps, name }) {
    super('HowTo');

    this.steps = steps;
    this.name = name;
    // image comes from Flora constants
    // https://github.com/10gen/flora/blob/v1.14.2/src/MDBLogo/constants.ts
    this.image =
      'https://webimages.mongodb.com/_com_assets/cms/kuyj2focmkbxv7gh3-stacked_default_slate_blue.svg?auto=format%252Ccompress';
  }
}

export class SoftwareSourceCodeSd extends StructuredData {
  constructor({ code, lang, slug }) {
    super('SoftwareSourceCode');
    this.codeSampleType = 'code snippet';
    // Sanitize all input in case HTML snippets are labeled with different language
    this.text = sanitize(code, { disallowedTagsMode: 'escape' });

    const programmingLanguage = getFullLanguageName(lang, slug);
    if (programmingLanguage) {
      this.programmingLanguage = programmingLanguage;
    }
  }
}

class TechArticleSd extends StructuredData {
  constructor({ headline, mainEntity, genre }) {
    super('TechArticle');

    this.author = {
      '@type': 'Organization',
      name: 'MongoDB Documentation Team',
    };
    this.headline = headline;
    this.mainEntity = mainEntity;
    if (genre) {
      this.genre = genre;
    }
  }
}

export class VideoObjectSd extends StructuredData {
  constructor({ embedUrl, name, uploadDate, thumbnailUrl, description }) {
    super('VideoObject');

    this.embedUrl = embedUrl;
    this.name = name;
    this.uploadDate = uploadDate;
    this.thumbnailUrl = thumbnailUrl;

    if (description) {
      this.description = description;
    }
  }

  isValid() {
    const hasAllReqFields = [this.embedUrl, this.name, this.uploadDate, this.thumbnailUrl].every((val) => !!val);
    return hasAllReqFields && super.isValid();
  }
}

/**
 * get TechArticle Structured Data from page facets and pageTitle.
 * @param   {{category: string, sub_facets: object[]}[]}  facets
 * @param   {string}                                      pageTitle
 * @returns {StructuredData}
 */
export const constructTechArticle = ({ facets, pageTitle }) => {
  // get display name from facets
  function getDisplayName(facet) {
    return facet.display_name;
  }

  // extract genre facets
  function getGenreNames(facets) {
    return facets?.filter((facet) => facet.category === 'genre').map(getDisplayName) || [];
  }

  // extract target product facets
  function getTargetProductsNames(facets) {
    // TODO: these products and sub products need version data from facets
    // https://jira.mongodb.org/browse/DOP-5037
    let res = [];
    const productFacets = facets?.filter((facet) => facet.category === 'target_product') || [];
    for (let index = 0; index < productFacets.length; index++) {
      const productFacet = productFacets[index];
      const subProducts =
        productFacet.sub_facets?.filter((facet) => facet.category === 'sub_product').map(getDisplayName) || [];
      if (subProducts.length) {
        res = res.concat(subProducts);
      } else {
        res.push(getDisplayName(productFacet));
      }
    }

    return res;
  }

  const techArticleProps = {
    mainEntity: getTargetProductsNames(facets).map((name) => ({
      '@type': 'SoftwareApplication',
      name: StructuredData.addCompanyToName(name),
      applicationCategory: 'DeveloperApplication',
      offers: {
        price: 0,
        priceCurrency: 'USD',
      },
    })),
    headline: pageTitle,
  };

  const genres = getGenreNames(facets);
  if (genres.length) {
    techArticleProps['genre'] = genres;
  }

  return new TechArticleSd(techArticleProps);
};

export const constructHowToSd = ({ steps, parentHeading }) => {
  function getHowToSection(procedureDirective, name) {
    const howToSection = {
      '@type': 'HowToSection',
      name,
      itemListElement: [],
    };

    for (const step of procedureDirective.children) {
      handleStep(step, howToSection['itemListElement']);
    }

    return howToSection;
  }

  /**
   *
   * @param {node}    step
   * @param {step[]}  targetList  can be either steps[] of HowTo or itemListElement[] of HowToSection
   */
  function handleStep(step, targetList) {
    if (step['name'] !== 'step') {
      return;
    }
    // text of step is derived from children, or fallback to step's argument
    const childText = getPlaintext(step.children);
    const argText = getPlaintext(step.argument);
    // NOTE: step.argument is repeated in step.children as a Heading component
    // so strip the heading from children
    const bodyText = childText.replace(argText, '');

    // deep search for nested procedure to make sibling sections
    const nestedProcedure = findKeyValuePair(step.children, 'name', 'procedure');
    if (nestedProcedure) {
      targetList.push(getHowToSection(nestedProcedure, argText || bodyText));
    } else {
      // build step
      const stepSD = {
        '@type': 'HowToStep',
        text: bodyText.length ? bodyText : argText,
      };
      if (bodyText.length && argText) {
        stepSD['name'] = argText;
      }
      targetList.push(stepSD);
    }
  }

  const howToProps = {
    steps: [],
    name: parentHeading,
  };

  for (const step of steps) {
    handleStep(step, howToProps['steps']);
  }

  return new HowToSd(howToProps);
};
