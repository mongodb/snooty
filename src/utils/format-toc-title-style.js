import React from 'react';

/*
  Function to provide an array of children styled via a provided object mapping 
  tagnames to keywords which to style with the given html tagnames.
*/
export const formatTocTitleStyle = (title, stylesObject) => {
  if (!stylesObject) return title;
  let formattedTitle = [title];
  Object.keys(stylesObject).forEach(tagname => {
    const keyword = stylesObject[tagname];
    formattedTitle = formattedTitle.map(child => {
      // This piece checks if a child is not a node type (string children support
      // `.includes`) and then adds React nodes formatted appropriately in the place
      // of the previous keyword text by adding it as a child and splitting up the previous
      // child text to exclude it.
      if (child.includes && child.includes(keyword)) {
        const subchildren = child.split(keyword);
        const lastSubchildIndex = subchildren.length - 1;
        const result = [];
        subchildren.forEach((subchild, i) => {
          // Add the existing string child to our result list
          result.push(subchild);
          if (i !== lastSubchildIndex) {
            // This combonation of the existing text and index is unique
            const key = subchild + i;
            // If this isn't the last subchild, also add a new react node
            result.push(React.createElement(tagname, { key }, keyword));
          }
        });
        return result;
      }
      return child;
    });
    formattedTitle = formattedTitle.flat();
  });
  return formattedTitle;
};
