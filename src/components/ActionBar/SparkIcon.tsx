import React from 'react';

import { createGlyphComponent } from '@leafygreen-ui/icon';

export const SparkleIcon = createGlyphComponent('Sparkle', (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M6.27413 2.89343L5.27579 5.88842C5.17568 6.18877 4.94 6.42445 4.63965 6.52456L1.64466 7.52289C1.18616 7.67573 1.18615 8.32427 1.64466 8.47711L4.63965 9.47544C4.94 9.57555 5.17568 9.81123 5.27579 10.1116L6.27413 13.1066C6.42696 13.5651 7.0755 13.5651 7.22834 13.1066L8.22667 10.1116C8.32679 9.81123 8.56247 9.57555 8.86281 9.47544L11.8578 8.47711C12.3163 8.32427 12.3163 7.67573 11.8578 7.52289L8.86281 6.52456C8.56247 6.42445 8.32679 6.18877 8.22667 5.88842L7.22834 2.89343C7.0755 2.43492 6.42696 2.43492 6.27413 2.89343Z"
      fill="url(#paint0_linear_7198_11304)"
    />
    <path
      d="M12.5477 1.17194L12.3166 1.8651C12.2165 2.16545 11.9808 2.40113 11.6805 2.50125L10.9873 2.7323C10.758 2.80872 10.758 3.13299 10.9873 3.20941L11.6805 3.44046C11.9808 3.54058 12.2165 3.77626 12.3166 4.0766L12.5477 4.76977C12.6241 4.99902 12.9483 4.99902 13.0248 4.76977L13.2558 4.0766C13.3559 3.77626 13.5916 3.54058 13.892 3.44046L14.5851 3.20941C14.8144 3.13299 14.8144 2.80872 14.5851 2.7323L13.892 2.50125C13.5916 2.40113 13.3559 2.16545 13.2558 1.8651L13.0248 1.17194C12.9483 0.942687 12.6241 0.942687 12.5477 1.17194Z"
      fill="url(#paint1_linear_7198_11304)"
    />
    <path
      d="M12.5477 11.2302L12.3166 11.9234C12.2165 12.2237 11.9808 12.4594 11.6805 12.5595L10.9873 12.7906C10.758 12.867 10.758 13.1913 10.9873 13.2677L11.6805 13.4988C11.9808 13.5989 12.2165 13.8346 12.3166 14.1349L12.5477 14.8281C12.6241 15.0573 12.9483 15.0573 13.0248 14.8281L13.2558 14.1349C13.3559 13.8346 13.5916 13.5989 13.892 13.4988L14.5851 13.2677C14.8144 13.1913 14.8144 12.867 14.5851 12.7906L13.892 12.5595C13.5916 12.4594 13.3559 12.2237 13.2558 11.9234L13.0248 11.2302C12.9483 11.001 12.6241 11.001 12.5477 11.2302Z"
      fill="url(#paint2_linear_7198_11304)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_7198_11304"
        x1="3.00078"
        y1="3"
        x2="12.5008"
        y2="14"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.0931517" stopColor="#00ED64" />
        <stop offset="1" stopColor="#0498EC" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_7198_11304"
        x1="3.00078"
        y1="3"
        x2="12.5008"
        y2="14"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.0931517" stopColor="#00ED64" />
        <stop offset="1" stopColor="#0498EC" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_7198_11304"
        x1="3.00078"
        y1="3"
        x2="12.5008"
        y2="14"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.0931517" stopColor="#00ED64" />
        <stop offset="1" stopColor="#0498EC" />
      </linearGradient>
    </defs>
  </svg>
));

export const ShortcutIcon = createGlyphComponent('MacShortcut', () => (
  <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.5" y="0.5" width="18" height="17" rx="8.5" fill="#F9FBFA" />
    <rect x="0.5" y="0.5" width="18" height="17" rx="8.5" stroke="#E8EDEB" />
    <path d="M6.44061 14.32L11.0726 4.48H12.5606L7.92861 14.32H6.44061Z" fill="#5C6C75" />
  </svg>
));
