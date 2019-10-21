export const formatTocTitleStyle = (title, stylesObject) => {
  let formattedTitle = title;
  Object.keys(stylesObject).forEach(tagname => {
    const keyword = stylesObject[tagname];
    const styledKeyword = `<${tagname}>${keyword}</${tagname}>`;
    formattedTitle = formattedTitle.replace(keyword, styledKeyword);
  });
  return formattedTitle;
};
