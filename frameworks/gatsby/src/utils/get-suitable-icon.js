import { withPrefix } from 'gatsby';

/**
 *
 * @param {string} icon
 * @param {boolean} iconDark
 * @param {boolean} isDarkMode
 * @returns {string}
 */
export const getSuitableIcon = (icon, iconDark, isDarkMode) => {
  if (typeof icon == 'string') {
    const isPath = icon.startsWith('/');
    const getIcon = `${icon}${isDarkMode ? '_inverse' : ''}`;
    const imageUrl = `https://webimages.mongodb.com/_com_assets/icons/${getIcon}.svg`;

    return isPath ? (isDarkMode && iconDark ? withPrefix(iconDark) : withPrefix(icon)) : imageUrl;
  }

  return '';
};
