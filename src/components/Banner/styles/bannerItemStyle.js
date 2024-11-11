import { css } from '@leafygreen-ui/emotion';
import { theme } from '../../../theme/docsTheme';
import { CONTENT_MAX_WIDTH } from '../../../templates/product-landing';

export const baseBannerStyle = css`
  margin: ${theme.size.default} 0;

  /* Add margins below all child elements in the banner */
  & > div > div > * {
    margin: 0 0 12px;
  }

  & > div > div > *:last-child {
    margin: 0;
  }

  /* Remove margins on individual paragraphs */
  p {
    margin: 0;
  }

  /* Force all content to be 13px in banners */
  font-size: ${theme.fontSize.small};

  p,
  a {
    font-size: ${theme.fontSize.small};
  }

  a {
    &:hover {
      text-underline-offset: 3px;
    }
  }
`;

export const offlineBannerStyle = ({ template }) => css`
  max-width: ${CONTENT_MAX_WIDTH}px;
  ${template !== 'instruqt' &&
  `margin-left: auto;
  margin-right: auto;`}
`;

// NOTE: banner is styled for
// product-landing,
// document
// instruqt,
// changelog
// update styling if needed for other templates
export const offlineBannerContainerStyle = ({ template }) => {
  return css`
    ${template === 'product-landing' &&
    `
    display: grid;
    grid-template-columns: minmax(64px, 1fr) repeat(1, minmax(0, ${CONTENT_MAX_WIDTH}px)) minmax(64px, 1fr);

    @media ${theme.screenSize.upToLarge} {
      grid-template-columns: 48px 1fr 48px;
    }

    @media ${theme.screenSize.upToMedium} {
      grid-template-columns: ${theme.size.medium} 1fr ${theme.size.medium};
    }

    > [role=alert] {
      grid-column: 2/2;
    }
  `}
  `;
};
