import { assertLeadingSlash } from '../../utils/assert-leading-slash';
import { removeTrailingSlash } from '../../utils/remove-trailing-slash';

interface BreadCrumb {
  path: string;
  title: string;
}

interface TocItem {
  label: string;
  glyph?: string;
  url?: string;
  group?: boolean;
  prefix?: string;
  collapsible?: boolean;
  breadcrumbs?: BreadCrumb[];
  items?: TocItem[];
}

// Goes through toc.toml and builds parent breadcrumb data for each entry
export function createParentFromToc(
  tree: TocItem[] | undefined,
  breadcrumbs: BreadCrumb[]
): (TocItem & { breadcrumbs: BreadCrumb[] })[] | undefined {
  return tree?.map((item) => {
    const newCrumbs = [...breadcrumbs];

    if (item.url) {
      const newBreadCrumb: BreadCrumb = {
        path: assertLeadingSlash(removeTrailingSlash(item.url)),
        title: item.label,
      };
      newCrumbs.push(newBreadCrumb);
    }

    const items = createParentFromToc(item.items, newCrumbs);

    return {
      ...item,
      items,
      breadcrumbs: newCrumbs,
    };
  });
}

// Finds breadcrumb through slug
export function findParentBreadCrumb(slug: string, tocTree: TocItem[]): BreadCrumb[] | undefined {
  for (const item of tocTree) {
    if (assertLeadingSlash(removeTrailingSlash(item.url)) === assertLeadingSlash(removeTrailingSlash(slug))) {
      return item.breadcrumbs?.slice(0, -1); // Removes last item which is the current item
    }

    if (item.items) {
      const found = findParentBreadCrumb(slug, item.items);
      if (found) return found;
    }
  }

  return undefined;
}
