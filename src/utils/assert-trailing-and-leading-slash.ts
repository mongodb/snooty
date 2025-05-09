import { assertLeadingSlash } from './assert-leading-slash';
import { assertTrailingSlash } from './assert-trailing-slash';

const assertLeadingAndTrailingSlash = (url: string) => {
  return assertLeadingSlash(assertTrailingSlash(url));
};

export default assertLeadingAndTrailingSlash;
