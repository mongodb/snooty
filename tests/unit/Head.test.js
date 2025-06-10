import React from 'react';
import { render, screen } from '@testing-library/react';
import { Head } from '../../src/components/DocumentBody';
import mockStaticQuery from '../utils/mockStaticQuery';
import * as siteMetadata from '../../src/hooks/use-site-metadata';
import useSnootyMetadata from '../../src/utils/use-snooty-metadata';
import { getAvailableLanguages } from '../../src/utils/locale';
import { DOTCOM_BASE_URL } from '../../src/utils/base-url';
import mockCompleteEOLPageContext from './data/CompleteEOLPageContext.json';
import mockEOLSnootyMetadata from './data/EOLSnootyMetadata.json';
import mockHeadPageContext from './data/HeadPageContext.test.json';
import metadataWithoutToc from './data/MetadataWithoutToc.json';

const siteMetadataMock = jest.spyOn(siteMetadata, 'useSiteMetadata');

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
      render(<Head pageContext={mockCompleteEOLPageContext.pageContext} data={mockCompleteEOLPageContext.data} />);
      const canonical = mockEOLSnootyMetadata.canonical;
      const canonicalTag = screen.getByTestId('canonical');
      expect(canonicalTag).toBeInTheDocument();
      expect(canonicalTag).toHaveAttribute('id', 'canonical');
      expect(canonicalTag).toHaveAttribute('rel', 'canonical');
      expect(canonicalTag).toHaveAttribute('href', canonical);
    });
  });

  describe("Canonical for EOL'd version", () => {
    beforeEach(() => {
      useSnootyMetadata.mockImplementation(() => mockEOLSnootyMetadata);
    });
    it('renders the canonical tag structured from the Head component with trailing slash', () => {
      const mockSiteUrl = 'https://www.mongodb.com';
      siteMetadataMock.mockImplementation(() => ({
        siteUrl: mockSiteUrl,
      }));
      render(<Head pageContext={mockHeadPageContext.pageContext} data={mockHeadPageContext.data} />);

      const canonical = `${mockEOLSnootyMetadata.canonical}`;

      const canonicalTag = screen.getByTestId('canonical');
      expect(canonicalTag).toBeInTheDocument();
      expect(canonicalTag).toHaveAttribute('id', 'canonical');
      expect(canonicalTag).toHaveAttribute('rel', 'canonical');
      expect(canonicalTag).toHaveAttribute('href', canonical);
    });
  });

  describe("Canonical for non-EoL'd", () => {
    beforeEach(() => {
      const modMockEOLSnootyMetadataToBeNotEOL = { ...mockEOLSnootyMetadata, eol: false };
      useSnootyMetadata.mockImplementation(() => modMockEOLSnootyMetadataToBeNotEOL);
    });

    it("uses the branch's url slug as the canonical for versioned docs", () => {
      siteMetadataMock.mockImplementation(() => ({
        siteUrl: 'https://www.mongodb.com',
        parserBranch: 'master',
      }));
      render(<Head pageContext={mockHeadPageContext.pageContext} data={mockHeadPageContext.data} />);

      const expectedCanonical = 'https://www.mongodb.com/docs/mongocli/upcoming/';

      const canonicalTag = screen.getByTestId('canonical');
      expect(canonicalTag).toBeInTheDocument();
      expect(canonicalTag).toHaveAttribute('id', 'canonical');
      expect(canonicalTag).toHaveAttribute('rel', 'canonical');
      expect(canonicalTag).toHaveAttribute('href', expectedCanonical);
    });

    it('includes the correct page slug', () => {
      siteMetadataMock.mockImplementation(() => ({
        siteUrl: 'https://www.mongodb.com',
        parserBranch: 'v1.26',
      }));

      const pageContext = { ...mockHeadPageContext.pageContext, slug: '/introduction' };
      render(<Head pageContext={pageContext} data={mockHeadPageContext.data} />);

      const expectedCanonical = 'https://www.mongodb.com/docs/mongocli/stable/introduction/';

      const canonicalTag = screen.getByTestId('canonical');
      expect(canonicalTag).toBeInTheDocument();
      expect(canonicalTag).toHaveAttribute('id', 'canonical');
      expect(canonicalTag).toHaveAttribute('rel', 'canonical');
      expect(canonicalTag).toHaveAttribute('href', expectedCanonical);
    });

    it('gracefully uses parserBranch for missing branches', () => {
      const mockedParserBranch = 'DOP-staging-branch';
      siteMetadataMock.mockImplementation(() => ({
        siteUrl: 'https://www.mongodb.com',
        parserBranch: mockedParserBranch,
      }));
      render(<Head pageContext={mockHeadPageContext.pageContext} data={mockHeadPageContext.data} />);

      const expectedCanonical = `https://www.mongodb.com/docs/mongocli/${mockedParserBranch}/`;

      const canonicalTag = screen.getByTestId('canonical');
      expect(canonicalTag).toBeInTheDocument();
      expect(canonicalTag).toHaveAttribute('id', 'canonical');
      expect(canonicalTag).toHaveAttribute('rel', 'canonical');
      expect(canonicalTag).toHaveAttribute('href', expectedCanonical);
    });

    it("uses the branch's url slug as the canonical for non-versioned docs", () => {
      siteMetadataMock.mockImplementation(() => ({
        siteUrl: 'https://www.mongodb.com',
        parserBranch: 'master',
      }));

      const nonVersionedBranchArr = [
        {
          gitBranchName: 'master',
          active: true,
          urlAliases: null,
          publishOriginalBranchName: false,
          urlSlug: '',
          versionSelectorLabel: 'master',
          isStableBranch: true,
          buildsWithSnooty: true,
        },
      ];
      const mockNonVersionedContext = {
        ...mockHeadPageContext.pageContext,
        slug: '/atlas-search/introduction',
        repoBranches: {
          branches: nonVersionedBranchArr,
          siteBasePrefix: 'docs/atlas',
        },
      };
      render(<Head pageContext={mockNonVersionedContext} data={mockHeadPageContext.data} />);

      const expectedCanonical = 'https://www.mongodb.com/docs/atlas/atlas-search/introduction/';

      const canonicalTag = screen.getByTestId('canonical');
      expect(canonicalTag).toBeInTheDocument();
      expect(canonicalTag).toHaveAttribute('id', 'canonical');
      expect(canonicalTag).toHaveAttribute('rel', 'canonical');
      expect(canonicalTag).toHaveAttribute('href', expectedCanonical);
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

    it('renders the canonical tag from directive rather than pulling from snooty.toml', () => {
      const mockPageContext = { ...mockHeadPageContext.pageContext };
      const mockData = { ...mockCompleteEOLPageContext.data };
      mockData.page.ast.children.push(metaCanonical);
      render(<Head pageContext={mockPageContext} data={mockData} />);

      const canonicalTag = screen.getByTestId('canonical');
      expectCanonicalTagToBeCorrect(canonicalTag);
    });

    it("renders the canonical tag from directive rather than pulling from stable branch (version eol'd)", () => {
      const mockPageContext = { ...mockHeadPageContext.pageContext };
      const mockData = { ...mockHeadPageContext.data };
      mockData.page.ast.children.push(metaCanonical);
      render(<Head pageContext={mockPageContext} data={mockData} />);

      const canonicalTag = screen.getByTestId('canonical');
      expectCanonicalTagToBeCorrect(canonicalTag);
    });

    it('renders the canonical tag from directive rather than pulling from default logic', () => {
      //need to override what happens in the beforeEach of this describe
      const modMockEOLSnootyMetadataToBeNotEOL = { ...mockEOLSnootyMetadata, eol: false };
      useSnootyMetadata.mockImplementation(() => modMockEOLSnootyMetadataToBeNotEOL);

      const mockPageContext = { ...mockHeadPageContext.pageContext };
      const mockData = { ...mockHeadPageContext.data };
      mockData.page.ast.children.push(metaCanonical);
      render(<Head pageContext={mockPageContext} data={mockData} />);

      const canonicalTag = screen.getByTestId('canonical');
      expectCanonicalTagToBeCorrect(canonicalTag);
    });
  });

  describe('hreflang links', () => {
    beforeEach(() => {
      useSnootyMetadata.mockImplementation(() => ({ ...mockEOLSnootyMetadata, eol: false }));
    });

    it.each([['/'], ['foo']])('renders based on slug', (slug) => {
      const mockPageContext = { ...mockHeadPageContext.pageContext, slug };
      const mockData = { ...mockHeadPageContext.data };
      const { container } = render(<Head pageContext={mockPageContext} data={mockData} />);
      const hrefLangLinks = container.querySelectorAll('link.sl_opaque');
      // Add 1 for x-default
      const expectedLength = getAvailableLanguages().length + 1;
      expect(hrefLangLinks).toHaveLength(expectedLength);
      expect(hrefLangLinks).toMatchSnapshot();
    });
  });

  describe('page title', function () {
    let metadata;
    const mockPageId = Object.keys(metadataWithoutToc['slugToTitle'])[0];
    const pageContext = {
      page_id: mockPageId,
      slug: mockPageId,
      repoBranches: { branches: [] },
    };
    const mockData = {
      page: {
        ast: {},
      },
    };
    beforeEach(function () {
      metadata = { ...metadataWithoutToc };
      useSnootyMetadata.mockImplementation(() => ({ ...metadata }));
    });

    it('correctly applies title, project name, and version', function () {
      const { container } = render(<Head pageContext={pageContext} data={mockData} />);
      const title = container.querySelector('title');
      expect(title.innerHTML).toBe(`Get Started with  - ${metadata.title} ${metadata.branch} - MongoDB Docs`);
    });

    it('defaults to project name and version if no page title', function () {
      metadata.slugToTitle = {};
      useSnootyMetadata.mockImplementation(() => ({ ...metadata }));
      const { container } = render(<Head pageContext={pageContext} data={mockData} />);
      const title = container.querySelector('title');
      expect(title.innerHTML).toBe(`${metadata.title} ${metadata.branch} - MongoDB Docs`);
    });

    it('only applies branch versions starting with a version number (v)', function () {
      metadata.branch = 'master';
      useSnootyMetadata.mockImplementation(() => ({ ...metadata }));
      const { container } = render(<Head pageContext={pageContext} data={mockData} />);
      const title = container.querySelector('title');
      expect(title.innerHTML).toBe(`Get Started with  - ${metadata.title} - MongoDB Docs`);
    });

    // highly not likely to be missing project, title, and version
    it('has a fallback if all properties are missing', function () {
      delete metadata.branch;
      delete metadata.title;
      metadata.slugToTitle = {};
      useSnootyMetadata.mockImplementation(() => ({ ...metadata }));
      const { container } = render(<Head pageContext={pageContext} data={mockData} />);
      const title = container.querySelector('title');
      expect(title.innerHTML).toBe(`MongoDB Documentation`);
    });
  });
});
