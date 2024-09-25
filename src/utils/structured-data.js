/**
 * Classes to construct Structured Data JSON.
 * Required props should be read in constructor function (to fail validity).
 * Optional props can be set conditionally.
 * Constant values should be set in the constructor function.
 * Optional overwrites can be set in params as default values
 */

export class StructuredData {
  constructor(type) {
    this['@context'] = 'https://schema.org';
    this['@type'] = 'TechArticle';
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

export class TechArticleSd extends StructuredData {
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
