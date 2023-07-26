import React from 'react';
import { render, screen } from '@testing-library/react';
import { Head } from '../../src/components/DocumentBody';
import mockStaticQuery from '../utils/mockStaticQuery';
import { useSiteMetadata } from '../../src/hooks/use-site-metadata';
import { usePathPrefix } from '../../src/hooks/use-path-prefix';
import mockCompleteEOLPageContext from './data/CompleteEOLPageContext.json';
import mockEOLSnootyMetadata from './data/EOLSnootyMetadata.json';
import mockHeadPageContext from './data/HeadPageContext.test.json';

describe('Head', () => {
  describe("Canonical for completely EOL'd", () => {
    beforeEach(() => {
      mockStaticQuery({}, mockEOLSnootyMetadata);
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
      mockStaticQuery({}, mockEOLSnootyMetadata);
    });
    it('renders the canonical tag structured from the Head component', () => {
      render(<Head pageContext={mockHeadPageContext} />);
      const { siteUrl } = useSiteMetadata();
      const urlSlug = 'stable';
      const siteBasePrefix = mockHeadPageContext.repoBranches.siteBasePrefix;

      const currentVersion = `${siteUrl}/${siteBasePrefix}/${urlSlug}`;

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
      mockStaticQuery({}, modMockEOLSnootyMetadataToBeNotEOL);
    });

    it('renders the canonical tag that points to itself', () => {
      render(<Head pageContext={mockHeadPageContext} />);
      const { siteUrl } = useSiteMetadata();
      const pathPrefix = usePathPrefix();
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
      mockStaticQuery({}, mockEOLSnootyMetadata);
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
      mockStaticQuery({}, modMockEOLSnootyMetadataToBeNotEOL);

      mockPageContext.page.children.push(metaCanonical);
      render(<Head pageContext={mockPageContext} />);

      const canonicalTag = screen.getByTestId('canonical');
      expectCanonicalTagToBeCorrect(canonicalTag);
    });
  });
});
