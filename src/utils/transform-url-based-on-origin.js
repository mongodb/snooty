import { productToPrefixMapping } from './dotcom';

const joinPrefixAndPathname = (prefix, pathname) => {
  if (pathname.startsWith(prefix)) return pathname;
  const needsTrim = prefix.endsWith('/') && pathname.startsWith('/');
  const needsSlash = !prefix.endsWith('/') && !pathname.startsWith('/');

  return needsTrim ? prefix.slice(-1) + pathname : needsSlash ? prefix + '/' + pathname : prefix + pathname;
};

/// DOP-2725: Temporary remapping of URL's based on the origin.
/// Old urls get the new scheme, and new urls get the old scheme.
/// This should be removed after rollout.
const transformUrlBasedOnOrigin = (url, host = null) => {
  if (host === null) {
    host = new URL(window.origin).host;
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch (err) {
    return url;
  }

  if (host === 'www.mongodb.com') {
    if (parsedUrl.host !== 'www.mongodb.com') {
      // Change to www.mongodb.com and add a docs/ prefix on the path
      const domainSpecifier = parsedUrl.host.match(/^docs\.([^.]+)\.mongodb\.com/);
      if (domainSpecifier === null) {
        parsedUrl.pathname = joinPrefixAndPathname('/docs', parsedUrl.pathname);
      } else {
        parsedUrl.pathname = joinPrefixAndPathname(
          '/docs/',
          productToPrefixMapping(domainSpecifier[1]) + parsedUrl.pathname
        );
      }

      parsedUrl.host = 'www.mongodb.com';
    }
  } else if (
    [
      'docs.cloudmanager.mongodb.com',
      'docs.opsmanager.mongodb.com',
      'docs.atlas.mongodb.com',
      'docs.mongodb.com',
    ].includes(host)
  ) {
    if (parsedUrl.host === 'www.mongodb.com') {
      // Change to docs.mongodb.com and remove the docs/ prefix on the path
      const pathStartMatch = parsedUrl.pathname.match(/^\/docs\/([^/]+)\//);
      const pathStart = pathStartMatch === null ? null : pathStartMatch[1];

      if (['ops-manager', 'cloud-manager', 'atlas'].includes(pathStart)) {
        parsedUrl.host = `docs.${pathStart.replace('-', '')}.mongodb.com`;
        parsedUrl.pathname = parsedUrl.pathname.replace(/^\/docs\/[^/]+(?=\/)/, '');
      } else {
        parsedUrl.host = 'docs.mongodb.com';
        parsedUrl.pathname = parsedUrl.pathname.replace(/^\/docs(?=\/)/, '');
      }
    }
  }

  return parsedUrl.toString();
};

export default transformUrlBasedOnOrigin;
