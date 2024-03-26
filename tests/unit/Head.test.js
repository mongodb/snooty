import React from 'react';
import { render, screen } from '@testing-library/react';
import { Head } from '../../src/components/DocumentBody';
import mockStaticQuery from '../utils/mockStaticQuery';
import { useSiteMetadata } from '../../src/hooks/use-site-metadata';
import { generatePrefix } from '../../src/components/VersionDropdown/utils';
import useSnootyMetadata from '../../src/utils/use-snooty-metadata';
import { AVAILABLE_LANGUAGES } from '../../src/utils/locale';
import { DOTCOM_BASE_URL } from '../../src/utils/base-url';
import mockCompleteEOLPageContext from './data/CompleteEOLPageContext.json';
import mockEOLSnootyMetadata from './data/EOLSnootyMetadata.json';
import mockHeadPageContext from './data/HeadPageContext.test.json';

jest.mock(`../../src/utils/use-snooty-metadata`, () => jest.fn());

describe('Head', () => {
  beforeEach(() => {
    mockStaticQuery({
      siteUrl: DOTCOM_BASE_URL,
    });
  });

  describe("Canonical for completely EOL'd", () => {
    beforeEach(() => {
      useSnootyMetadata.mockImplementation(() => mockEOLSnootyMetadata);
    });
    it('renders the canonical tag from the snooty.toml', () => {
      render(<Head pageContext={mockCompleteEOLPageContext} />);
      const _canonical = mockEOLSnootyMetadata.canonical;
      const canonicalTag = screen.getByTestId('canonical');
      expect(canonicalTag).toBeInTheDocument();
      expect(canonicalTag).toHaveAttribute('id', 'canonical');
      expect(canonicalTag).toHaveAttribute('rel', 'canonical');
      expect(canonicalTag).toHaveAttribute('href', _canonical);
    });
  });

  describe("Canonical for EOL'd version", () => {
    beforeEach(() => {
      useSnootyMetadata.mockImplementation(() => mockEOLSnootyMetadata);
    });
    it('renders the canonical tag structured from the Head component with trailing slash', () => {
      render(<Head pageContext={mockHeadPageContext} />);
      const { siteUrl } = useSiteMetadata();
      const urlSlug = 'stable';
      const siteBasePrefix = mockHeadPageContext.repoBranches.siteBasePrefix;

      const currentVersion = `${siteUrl}/${siteBasePrefix}/${urlSlug}/`;

      const canonicalTag = screen.getByTestId('canonical');
      expect(canonicalTag).toBeInTheDocument();
      expect(canonicalTag).toHaveAttribute('id', 'canonical');
      expect(canonicalTag).toHaveAttribute('rel', 'canonical');
      expect(canonicalTag).toHaveAttribute('href', currentVersion);
    });
  });

  describe("Canonical for non-EoL'd", () => {
    beforeEach(() => {
      const modMockEOLSnootyMetadataToBeNotEOL = { ...mockEOLSnootyMetadata, eol: false };
      useSnootyMetadata.mockImplementation(() => modMockEOLSnootyMetadataToBeNotEOL);
    });

    it('renders the canonical tag that points to itself', () => {
      render(<Head pageContext={mockHeadPageContext} />);
      const siteMetadata = useSiteMetadata();
      const { siteUrl, parserBranch } = siteMetadata;
      const urlSlug = mockHeadPageContext.repoBranches.branches.find(
        (branch) => branch.gitBranchName === parserBranch
      )?.urlSlug;
      const pathPrefix = generatePrefix(urlSlug, siteMetadata);
      const slug = mockHeadPageContext.slug;

      const canonical = `${siteUrl}${pathPrefix}/${slug === '/' ? '' : slug}`;

      const canonicalTag = screen.getByTestId('canonical');
      expect(canonicalTag).toBeInTheDocument();
      expect(canonicalTag).toHaveAttribute('id', 'canonical');
      expect(canonicalTag).toHaveAttribute('rel', 'canonical');
      expect(canonicalTag).toHaveAttribute('href', canonical);
    });
  });

  describe('Canonical when pulled from directive', () => {
    beforeEach(() => {
      useSnootyMetadata.mockImplementation(() => mockEOLSnootyMetadata);
    });

    const metaCanonical = {
      type: 'directive',
      children: [],
      domain: '',
      name: 'meta',
      argument: [],
      options: {
        canonical: 'http://we-the-best.com',
      },
    };

    const expectCanonicalTagToBeCorrect = (canonicalTag) => {
      expect(canonicalTag).toBeInTheDocument();
      expect(canonicalTag).toHaveAttribute('id', 'canonical');
      expect(canonicalTag).toHaveAttribute('rel', 'canonical');
      expect(canonicalTag).toHaveAttribute('href', metaCanonical.options.canonical);
    };

    let mockPageContext = mockHeadPageContext;
    it('renders the canonical tag from directive rather than pulling from snooty.toml', () => {
      mockPageContext = mockCompleteEOLPageContext;
      mockPageContext.page.children.push(metaCanonical);
      render(<Head pageContext={mockPageContext} />);

      const canonicalTag = screen.getByTestId('canonical');
      expectCanonicalTagToBeCorrect(canonicalTag);
    });

    it("renders the canonical tag from directive rather than pulling from stable branch (version eol'd)", () => {
      mockPageContext.page.children.push(metaCanonical);
      render(<Head pageContext={mockPageContext} />);

      const canonicalTag = screen.getByTestId('canonical');
      expectCanonicalTagToBeCorrect(canonicalTag);
    });

    it('renders the canonical tag from directive rather than pulling from default logic', () => {
      //need to override what happens in the beforeEach of this describe
      const modMockEOLSnootyMetadataToBeNotEOL = { ...mockEOLSnootyMetadata, eol: false };
      useSnootyMetadata.mockImplementation(() => modMockEOLSnootyMetadataToBeNotEOL);

      mockPageContext.page.children.push(metaCanonical);
      render(<Head pageContext={mockPageContext} />);

      const canonicalTag = screen.getByTestId('canonical');
      expectCanonicalTagToBeCorrect(canonicalTag);
    });
  });

  describe('hreflang links', () => {
    beforeEach(() => {
      useSnootyMetadata.mockImplementation(() => ({ ...mockEOLSnootyMetadata, eol: false }));
    });

    it.each([['/'], ['foo']])('renders based on slug', (slug) => {
      const mockPageContext = { ...mockHeadPageContext, slug };
      const { container } = render(<Head pageContext={mockPageContext} />);
      const hrefLangLinks = container.querySelectorAll('link.sl_opaque');
      expect(hrefLangLinks).toHaveLength(AVAILABLE_LANGUAGES.length);
      expect(hrefLangLinks).toMatchSnapshot();
    });
  });
});
