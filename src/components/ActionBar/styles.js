import { palette } from '@leafygreen-ui/palette';
import { css } from '@leafygreen-ui/emotion';
import { theme } from '../../theme/docsTheme';
import { CONTENT_MAX_WIDTH } from '../../templates/product-landing';

export const actionBarStyling = css`
  height: 60px;
  padding-top: ${theme.size.small};
  padding-bottom: ${theme.size.small};
  position: sticky;
  top: 0;
  z-index: ${theme.zIndexes.actionBar};
  background-color: var(--background-color-primary);
  border-bottom: 1px solid var(--border-color);

  --border-color: ${palette.gray.light2};

  .dark-theme & {
    --border-color: ${palette.gray.dark2};
  }

  @media ${theme.screenSize.mediumAndUp} {
    & > div {
      flex: 0 1 auto;
    }
  }

  @media ${theme.screenSize.upToMedium} {
    justify-content: space-between;
    padding-right: 0;
  }
`;

const gridStyling = css`
  display: grid;
  grid-template-columns: minmax(${theme.size.xlarge}, 1fr) minmax(0, ${CONTENT_MAX_WIDTH}px) minmax(
      ${theme.size.xlarge},
      1fr
    );

  @media ${theme.screenSize.upToLarge} {
    grid-template-columns: 48px 1fr 48px;
  }
  @media ${theme.screenSize.upToMedium} {
    grid-template-columns: ${theme.size.medium} 1fr ${theme.size.medium};
  }
`;

const flexStyling = css`
  display: flex;
  justify-content: space-between;
  width: 100%;
  flex-wrap: wrap;
  padding-left: ${theme.size.xlarge};
`;

export const getContainerStyling = (template) => {
  let className, fakeColumns;
  switch (template) {
    case 'product-landing':
      className = gridStyling;
      fakeColumns = true;
      break;
    case 'landing':
      className = gridStyling;
      fakeColumns = true;
      break;
    default:
      className = flexStyling;
      break;
  }

  return { className, fakeColumns };
};

export const actionsBoxStyling = ({ template }) => css`
  ${template === 'product-landing' &&
  `position: absolute;
  top: ${theme.fontSize.tiny};
  right: ${theme.size.large};`}

  ${template !== 'product-landing' &&
  `
  margin-left: auto;
  padding-right: ${theme.size.large};
  @media ${theme.screenSize.upToMedium} {
    padding-left: 3rem;
  }

  @media ${theme.screenSize.upToSmall} {
    padding-left: 2rem;
  }
`}
`;
