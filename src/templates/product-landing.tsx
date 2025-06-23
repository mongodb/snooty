import React, { ReactNode } from 'react';
import styled from '@emotion/styled';
import { cx, css } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import { theme } from '../theme/docsTheme';
import { findKeyValuePair } from '../utils/find-key-value-pair.js';
import useSnootyMetadata from '../utils/use-snooty-metadata';
import FeedbackRating from '../components/Widgets/FeedbackWidget';
import { DEPRECATED_PROJECTS } from '../components/Contents/index';
import { AppData, PageContext } from '../types/data';
import { Node } from '../types/ast';
export const CONTENT_MAX_WIDTH = 1200;

const formstyle = css`
  position: absolute;
  left: 0;
  bottom: 0;
  margin-top: ${theme.size.tiny};

  @media ${theme.screenSize.upToLarge} {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow-y: auto;
  }
`;

const formContainer = css`
  position: relative;

  @media ${theme.screenSize.tablet} {
    z-index: 1;
  }
`;

const hrStyling = css`
  border-color: ${palette.gray.light2};
  margin: ${theme.size.medium} ${theme.size.xlarge};
`;

const ratingStlying = css`
  margin: 0px ${theme.size.xlarge};
`;

const Wrapper = styled('main')<{
  isGuides: boolean;
  isRealm: boolean;
  hasBanner: boolean;
  hasLightHero: boolean;
  hasMaxWidthParagraphs: boolean;
}>`
  ${({ isGuides }) => !isGuides && `margin: 0 auto ${theme.size.xlarge} auto;`}
  width: 100%;

  h1 {
    color: var(--font-color-primary);
  }

  h2 {
    margin-top: ${theme.size.small};
    margin-bottom: ${theme.size.small};
  }

  h3 {
    font-weight: 600;
    font-size: 16px;
    line-height: 28px;
    margin-bottom: 8px;
  }

  section {
    max-width: 100%;
  }

  section p {
    grid-column: 2;
    ${({ hasMaxWidthParagraphs }) => !hasMaxWidthParagraphs && 'max-width: 500px;'}
  }

  // realm PLP has full width p
  ${({ isRealm }) =>
    isRealm &&
    `
    section > p {
      grid-column: 2/-2;
      max-width: 775px;
    }

    section ul  {
      grid-column: 2;
      max-width: 500px;
    }
  `}

  // Light-colored hero styling
  ${({ hasLightHero }) =>
    hasLightHero &&
    `
    @media ${theme.screenSize.mediumAndUp} {
      h1 {
        color: ${palette.black};
      }

      .introduction > p:first-of-type {
        color: ${palette.black};
      }
    }
  `}

  section p > a {
    letter-spacing: 0.5px;
    :hover {
      text-decoration: none;
    }
  }

  & > section {
    display: grid;
    // Create columns such that the 2 outer ones act like margins.
    // This will allow the hero image to span across the whole content while still being a part
    // of the DOM flow.
    grid-template-columns: minmax(${theme.size.xlarge}, 1fr) repeat(2, minmax(0, ${CONTENT_MAX_WIDTH / 2}px)) minmax(
        ${theme.size.xlarge},
        1fr
      );
    grid-template-rows: [header] auto [introduction] auto [kicker] auto;
    ${({ hasBanner }) =>
      hasBanner && `grid-template-rows: [banner] auto [header] auto [introduction] auto [kicker] auto;`}

    @media ${theme.screenSize.upToLarge} {
      grid-template-columns: 48px 1fr 48px;
    }

    @media ${theme.screenSize.upToMedium} {
      grid-template-columns: ${theme.size.medium} 1fr ${theme.size.medium};
    }

    [role='alert'] {
      grid-column: 2 / 3;
      grid-row: banner;
      align-items: center;
    }

    h1 {
      align-self: end;
      grid-column: 2;
      grid-row: header;

      ${({ isGuides }) =>
        isGuides &&
        `
        @media ${theme.screenSize.mediumAndUp} {
          color: ${palette.white};
        }
      `}
    }

    > img,
    > .gatsby-image-wrapper {
      display: block;
      grid-column: 2;
      margin-top: auto;
      max-width: 600px;
      width: 100%;

      @media ${theme.screenSize.largeAndUp} {
        grid-column: 3;
        grid-row: header/span 2;
      }
    }

    > .hero-img {
      grid-column: 1 / -1;
      grid-row: header / kicker;
      height: 310px;
      ${({ isGuides }) => !isGuides && `margin-bottom: ${theme.size.large};`}
      max-width: 100%;
      object-fit: cover;
      z-index: -1;

      @media ${theme.screenSize.upToMedium} {
        object-position: 100%;
        grid-row: unset;
      }

      @media ${theme.screenSize.upToSmall} {
        grid-row: unset;
        height: 200px;
      }
    }

    > .introduction {
      grid-column: 2;
      grid-row: introduction;
      p {
        ${({ isGuides }) =>
          isGuides &&
          `
            @media ${theme.screenSize.mediumAndUp} {
                color: ${palette.white};
            }
        `}
      }
    }

    > .chapters {
      grid-column: 1 / -1;
    }

    // Sub-sections should use all but the outer columns.
    > section {
      grid-column: 2 / -2 !important;
      overflow: hidden;
    }
    // Card-groups may occasionally not be nested within sections (see: Realm
    // PLP) but should be constrained to the inner columns regardless
    .card-group {
      grid-column: 2 / -2 !important;
    }
  }
`;

const REALM_LIGHT_HERO_PAGES = ['index.txt'];

function stripChildren<T extends Node>(node: T): Omit<T, 'children'> {
  const { children, ...rest } = node as any;
  return rest;
}

export type ProductLandingProps = {
  children: ReactNode;
  data: AppData;
  pageContext: PageContext;
  offlineBanner: JSX.Element;
};

const ProductLanding = ({ children, data: { page }, offlineBanner, pageContext: { slug } }: ProductLandingProps) => {
  const { project } = useSnootyMetadata();
  const isGuides = project === 'guides';
  const isRealm = project === 'realm';
  const pageOptions = page?.ast?.options;
  const hasMaxWidthParagraphs = ['', 'true'].includes(pageOptions?.['pl-max-width-paragraphs']);
  const hasLightHero = isRealm && REALM_LIGHT_HERO_PAGES.includes(page?.ast?.fileid);
  // shallow copy children, and search for existence of banner
  const shallowChildren = (Array.isArray(children) ? children : [children]).reduce<Node[]>((res, child) => {
    const copiedChildren = child.props.nodeData?.children?.map((childNode: Node) => stripChildren(childNode)) ?? [];
    res = res.concat(copiedChildren);
    return res;
  }, []);

  const bannerNode = findKeyValuePair([{ children: shallowChildren }], 'name', 'banner');

  return (
    <Wrapper
      isGuides={isGuides}
      isRealm={isRealm}
      hasBanner={!!bannerNode}
      hasLightHero={hasLightHero}
      hasMaxWidthParagraphs={hasMaxWidthParagraphs}
    >
      {offlineBanner}
      {children}
      {!DEPRECATED_PROJECTS.includes(project) && (
        <>
          <hr className={cx(hrStyling)} />
          <div className={cx(ratingStlying)}>
            <FeedbackRating slug={slug} className={formstyle} classNameContainer={formContainer} />
          </div>
        </>
      )}
    </Wrapper>
  );
};

export default ProductLanding;
