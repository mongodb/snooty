import { generatePathPrefix } from '../../../utils/generate-path-prefix';
import { normalizePath } from '../../../utils/normalize-path';

const getResourceLinkUrl = (metadata, tag, operationId, openapi_pages = {}) => {
  const pathPrefix = generatePathPrefix(metadata);
  const resourceTag = `#tag/${tag.split(' ').join('-')}/operation/${operationId}`;
  const oaSpecPageRoute =
    Object.keys(openapi_pages).find((page) => page.includes('v2')) ||
    Object.keys(openapi_pages).find((page) => !page.includes('v1')) ||
    'reference/api-resources-spec/v2';

  return `${pathPrefix}${normalizePath(`/${oaSpecPageRoute}/${resourceTag}`)}`;
};

export default getResourceLinkUrl;
