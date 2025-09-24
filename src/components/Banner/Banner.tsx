import React from 'react';
import { palette } from '@leafygreen-ui/palette';
import LeafyBanner, { Variant as LeafyVariant } from '@leafygreen-ui/banner';
import { css, cx } from '@leafygreen-ui/emotion';
import { getCurrLocale } from '../../utils/locale';
import ComponentFactory from '../ComponentFactory';
import type { BannerNode } from '../../types/ast';
import { baseBannerStyle } from './styles/bannerItemStyle';

export const alertMap = {
  info: LeafyVariant.Info,
  warning: LeafyVariant.Warning,
  danger: LeafyVariant.Danger,
};

const styleMapLight = {
  info: {
    backgroundColor: palette.blue.light3,
    color: palette.blue.dark2,
    borderColor: palette.blue.light2,
    linkColor: palette.blue.dark3,
    beforeColor: palette.blue.base,
    iconColor: palette.blue.base,
  },
  warning: {
    backgroundColor: palette.yellow.light3,
    color: palette.yellow.dark2,
    borderColor: palette.yellow.light2,
    linkColor: palette.yellow.dark3,
    beforeColor: palette.yellow.base,
    iconColor: palette.yellow.dark2,
  },
  danger: {
    backgroundColor: palette.red.light3,
    color: palette.red.dark2,
    borderColor: palette.red.light2,
    linkColor: palette.red.dark3,
    beforeColor: palette.red.base,
    iconColor: palette.red.base,
  },
};
const styleMapDark = {
  info: {
    backgroundColor: palette.blue.dark3,
    color: palette.blue.light2,
    borderColor: palette.blue.dark2,
    linkColor: palette.blue.light3,
    beforeColor: palette.blue.light1,
    iconColor: palette.blue.light1,
  },
  warning: {
    backgroundColor: palette.yellow.dark3,
    color: palette.yellow.light2,
    borderColor: palette.yellow.dark2,
    linkColor: palette.yellow.light3,
    beforeColor: palette.yellow.dark2,
    iconColor: palette.yellow.base,
  },
  danger: {
    backgroundColor: palette.red.dark3,
    color: palette.red.light2,
    borderColor: palette.red.dark2,
    linkColor: palette.red.light3,
    beforeColor: palette.red.base,
    iconColor: palette.red.light1,
  },
};

const bannerStyle = ({ variant }: BannerNode['options']) => css`
  ${baseBannerStyle}
  background-color: ${styleMapLight[variant].backgroundColor};
  color: ${styleMapLight[variant].color};
  border-color: ${styleMapLight[variant].borderColor};
  // copied from LG
  ::before {
    background: linear-gradient(to left, transparent 6px, ${styleMapLight[variant].beforeColor} 6px);
  }
  a {
    color: ${styleMapLight[variant].linkColor};
    :hover {
      color: ${styleMapLight[variant].color};
      text-decoration-color: ${styleMapLight[variant].color};
    }
  }
  > svg {
    color: ${styleMapLight[variant].iconColor};
  }

  .dark-theme & {
    background-color: ${styleMapDark[variant].backgroundColor};
    color: ${styleMapDark[variant].color};
    border-color: ${styleMapDark[variant].borderColor};
    ::before {
      background: linear-gradient(to left, transparent 6px, ${styleMapDark[variant].beforeColor} 6px);
    }
    a {
      color: ${styleMapDark[variant].linkColor};
      :hover {
        color: ${styleMapDark[variant].color};
        text-decoration-color: ${styleMapDark[variant].color};
      }
    }
    > svg {
      color: ${styleMapDark[variant].iconColor};
    }
  }
`;

interface BannerProps {
  nodeData: BannerNode;
}

const Banner = (props: BannerProps) => {
  // handling the nested destructing in the body, to allow cleaner debugging.
  const { nodeData, ...rest } = props;
  const { children, options } = nodeData;
  // Get the current locale (language + region) i.e. es-US, fr-FR
  const locale = getCurrLocale();

  // if banner has option locale, then only render the banner for said translated page.
  // Let us first do a string to array conversion for better accuracy
  const locales = options?.locale?.split(',');
  if (locales && !locales.includes(locale)) {
    return <div />;
  }

  return (
    <LeafyBanner className={cx(bannerStyle({ variant: alertMap[options?.variant] || LeafyVariant.Info }))}>
      {children.map((child, i) => (
        <ComponentFactory {...rest} key={i} nodeData={child} />
      ))}
    </LeafyBanner>
  );
};

export default Banner;
