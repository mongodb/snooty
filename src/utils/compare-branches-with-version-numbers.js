/**
 * Function to be used with sort() to sort a list of git branch names in the
 * following order:
 * - "current" is the first entry, if applicable
 * - "master" is the second entry, if applicable
 * - Branch version numbers are then provided in most-recent-first order
 * @param {string} branchA the first branch
 * @param {string} branchB
 */
export const compareBranchesWithVersionNumbers = (branchA, branchB) => {
  if (branchA === 'current') return -1;
  if (branchB === 'current') return 1;
  if (branchA === 'master') return -1;
  if (branchB === 'master') return 1;
  // We want to account for these strings not having the same number of characters
  // per part of the version number
  return parseVersionBranchForSort(branchB).localeCompare(parseVersionBranchForSort(branchA));
};

// This helper method replaces a number in a version string with it plus 10 to account for single
// digit portions of a version number. It also removes `v` found on some for sort purposes
const parseVersionBranchForSort = (branchString) => branchString.replace(/v/g, '').replace(/\d+/g, (n) => +n + 10);
