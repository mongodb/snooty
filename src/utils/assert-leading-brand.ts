type options = {
  titleCase: boolean;
};

const assertLeadingBrand = (title: string, options?: options): string => {
  const casingFn = options?.titleCase
    ? (e: string) =>
        e
          // replaces starting characters with upper case unless there is a mix of casing
          .replace(/(\w\S*)/g, (text) => {
            return text.match(/[a-z]+[A-Z]+/) ? text : text.charAt(0).toUpperCase() + text.substring(1);
          })
          // replaces characters after hypen with upper case
          .replace(/(-\w*)/g, (text) => text.substring(0, 1) + text.charAt(1).toUpperCase() + text.substring(2))
    : (e: string) => e;
  const titleIncludesBrand = title.toLowerCase().startsWith('mongodb');
  if (!titleIncludesBrand) {
    return `MongoDB ${casingFn(title.replace(/mongodb/i, ''))}`.trimEnd();
  }
  return casingFn(title)
    .replace(/mongodb/i, 'MongoDB')
    .trimEnd();
};

export default assertLeadingBrand;
