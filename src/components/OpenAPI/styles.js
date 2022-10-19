import { css } from '@emotion/react';
import { uiColors } from '@leafygreen-ui/palette';
import { theme } from '../../theme/docsTheme';

const badgeBorderRadius = '50px';
const badgeBorderType = '1px solid';
const codeFontFamily = 'Source Code Pro';
const inlineCodeBackgroundColor = uiColors.gray.light3;
const inlineCodeBorderColor = uiColors.gray.light1;
const schemaDataTypeColor = uiColors.blue.dark3;
const textFontFamily = 'Akzidenz';

// Redoc's theme option: https://github.com/Redocly/redoc/#redoc-theme-object
export const themeOption = {
  breakpoints: {
    small: '768px',
    medium: '1024px',
    large: '1200px',
  },
  codeBlock: {
    backgroundColor: uiColors.black,
  },
  colors: {
    error: {
      main: uiColors.red.dark1,
    },
    // Only applies to background color; color and border color touched by css
    http: {
      get: uiColors.blue.light3,
      post: uiColors.green.light3,
      put: uiColors.yellow.light3,
      patch: uiColors.yellow.light3,
      delete: uiColors.red.light3,
    },
    primary: {
      main: uiColors.gray.dark3,
    },
    responses: {
      success: {
        color: uiColors.green.dark1,
        backgroundColor: uiColors.green.light3,
        tabTextColor: uiColors.green.base,
      },
      error: {
        color: uiColors.red.dark1,
        backgroundColor: uiColors.red.light3,
        tabTextColor: uiColors.red.base,
      },
    },
    text: {
      primary: uiColors.gray.dark3,
    },
    warning: {
      main: uiColors.yellow.light3,
      contrastText: uiColors.yellow.dark2,
    },
  },
  rightPanel: {
    backgroundColor: uiColors.gray.dark3,
  },
  schema: {
    requireLabelColor: uiColors.red.base,
  },
  sidebar: {
    activeTextColor: `${uiColors.green.dark3} !important`,
    backgroundColor: uiColors.gray.light3,
    textColor: uiColors.gray.dark3,
    width: '268px',
  },
  spacing: {
    unit: 4,
    sectionVertical: 16,
  },
  typography: {
    fontSize: theme.fontSize.default,
    fontFamily: textFontFamily,
    headings: {
      fontFamily: textFontFamily,
    },
    code: {
      backgroundColor: inlineCodeBackgroundColor,
      color: uiColors.black,
      fontFamily: codeFontFamily,
      fontSize: theme.fontSize.small,
    },
    links: {
      color: uiColors.blue.base,
      hover: uiColors.blue.dark2,
      visited: uiColors.blue.base,
    },
  },
};

export const codeBlockCss = css`
  // General code tags, especially for code blocks
  code {
    font-family: ${codeFontFamily};
  }

  // Code block divs
  div.hoverable {
    color: ${uiColors.white};
  }

  // Highlight syntax in code blocks
  span.ellipsis:after {
    color: ${uiColors.white};
  }
  span.token.boolean {
    color: #e06c75 !important;
  }
  span.token.keyword {
    color: #c678dd !important;
  }
  span.token.number {
    color: #61aeee !important;
  }
  span.token.punctuation {
    color: ${uiColors.white};
  }
  span.token.string:not(.property) {
    color: #98c379 !important;
  }
`;

export const inlineCodeCss = css`
  // InlineCode inside of Parameters and Schemas
  span.sc-eLgOdN,
  // InlineCode found in data types of Parameters and Schemas; example: "string 24 characters"
  span.sc-kIeTtH {
    background-color: ${inlineCodeBackgroundColor};
    border-color: ${inlineCodeBorderColor};
  }
`;

export const leftSidebarCss = css`
  label[role='menuitem'] {
    :hover {
      background-color: ${uiColors.gray.light2};
    }
    &.active {
      background-color: ${uiColors.green.light3};
    }
  }
`;

export const rightSidebarCss = css`
  ul.react-tabs__tab-list {
    li[role='tab'] {
      background-color: ${uiColors.gray.dark2};
      border: unset;
    }
  }
`;

export const schemaDataTypesCss = css`
  // Request Body Schema "One of" pills
  button.sc-fKFyDc {
    border-radius: ${badgeBorderRadius};
  }

  // Responses buttons
  button.sc-eFubAy {
    border-radius: 6px;
  }

  // Data types under query parameters; ex - "string" / "boolean"
  span.sc-fWSCIC,
  // Regex next to data types under query parameters; ex - "^([\w]{24})$"
  span.sc-hlTvYk,
  // "Array of" keyword next to data types under query parameters
  span.sc-GqfZa,
  // Parenthesized data types under query paramters; ex - "(ObjectId)"
  span.sc-dwfUOf {
    color: ${schemaDataTypeColor};
  }
`;

export const spanHttpCss = css`
  span.get {
    border: ${badgeBorderType} ${uiColors.blue.light2};
    color: ${uiColors.blue.dark2};
  }
  span.post {
    border: ${badgeBorderType} ${uiColors.green.light2};
    color: ${uiColors.green.dark2};
  }
  span.patch,
  span.put {
    border: ${badgeBorderType} ${uiColors.yellow.light2};
    color: ${uiColors.yellow.dark2};
  }
  span.delete {
    border: ${badgeBorderType} ${uiColors.red.light2};
    color: ${uiColors.red.dark2};
  }

  // Left sidebar badges
  span.operation-type {
    border-radius: ${badgeBorderRadius};
    font-family: ${textFontFamily};
  }

  // Right sidebar badges
  span.http-verb {
    border-radius: ${badgeBorderRadius};
    font-weight: bold;
  }
`;

export const deprecatedBadgeCss = css`
  // "deprecated" badge
  span[type='warning'] {
    border: ${badgeBorderType} ${uiColors.yellow.light2};
    border-radius: ${badgeBorderRadius};
  }
`;
