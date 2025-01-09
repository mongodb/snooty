type options = {
  titleCase: boolean;
};

const assertLeadingBrand = (title: string, options?: options): string => {
  const casingFn = options?.titleCase
    ? (e: string) => e.replace(/\w\S*/g, (text) => text.charAt(0).toUpperCase())
    : (e: string) => e;
  if (title.toLowerCase().replace(/\s+/g, '').includes('mongodb')) {
    return casingFn(title);
  }
  return `MongoDB ${casingFn(title)}`;
};

export default assertLeadingBrand;
