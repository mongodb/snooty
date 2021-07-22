/*
 * Returns plaintext nested text values from AST nodes
 */

export const getNestedText = (array) => {
  if (array.length == 0) return '';

  if (array[0].children) {
    return getNestedText(array[0].children) + getNestedText(array.slice(1));
  }

  if (array[0].type == 'text') {
    return array[0].value + getNestedText(array.slice(1));
  }

  return '';
};
