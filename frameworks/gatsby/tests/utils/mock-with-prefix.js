import * as Gatsby from 'gatsby';

const withPrefix = jest.spyOn(Gatsby, 'withPrefix');

export const mockWithPrefix = (prefix) => {
  withPrefix.mockImplementation((path) => {
    let normalizedPrefix = prefix;
    let normalizedPath = path;

    if (!normalizedPrefix.startsWith('/')) {
      normalizedPrefix = `/${normalizedPrefix}`;
    }

    if (normalizedPrefix.endsWith('/')) {
      normalizedPrefix = normalizedPath.slice(0, -1);
    }

    if (normalizedPath.startsWith('/')) {
      normalizedPath = normalizedPath.slice(1);
    }

    return `${normalizedPrefix}/${normalizedPath}`;
  });
};
