import { withPrefix } from 'gatsby';

/**
 *
 * @param {boolean} isDarkMode
 * @param {boolean} iconDark
 * @param {string} icon
 * @returns {string}
 */
export const getSuitableIcon = (isDarkMode, iconDark, icon) => {
  if (icon) {
    const isPath = icon.startsWith('/');
    const getIcon = `${icon}${isDarkMode ? '_inverse' : ''}`;
    const imageUrl = `https://webimages.mongodb.com/_com_assets/icons/${getIcon}.svg`;

    return isPath ? (isDarkMode && iconDark ? withPrefix(iconDark) : withPrefix(icon)) : imageUrl;
  }

  return '';
};
