import React from 'react';
import { withPrefix } from 'gatsby';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import { getPlaintext } from '../utils/get-plaintext';
import type { TwitterNode } from '../types/ast';

const isExternalUrl = /^http(s)?:\/\//;

const getImageUrl = (src?: string, siteUrl?: string) => {
  if (!src) {
    return null;
  }
  return isExternalUrl.test(src) ? src : `${siteUrl}${withPrefix(src)}`;
};

/* Extends Twitter card as defined in SEO component */
const Twitter = ({
  nodeData: { children, options: { creator, image, 'image-alt': imageAlt, site, title } = {} },
}: {
  nodeData: TwitterNode;
}) => {
  const { siteUrl } = useSiteMetadata();
  const description = children.length ? getPlaintext(children) : null;
  const imageSrc = getImageUrl(image, siteUrl);
  return (
    <>
      {site && <meta name="twitter:site" content={site} />}
      {creator && <meta name="twitter:creator" content={creator} />}
      {title && <meta property="twitter:title" content={title} />}
      {description && <meta property="twitter:description" content={description} />}
      {imageSrc && <meta name="twitter:image" content={imageSrc} />}
      {imageAlt && <meta name="twitter:image:alt" content={imageAlt} />}
    </>
  );
};

export default Twitter;
