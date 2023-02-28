export const isFullBuild = (snootyEnv) =>
  snootyEnv !== 'production' || process.env.PREVIEW_BUILD_ENABLED?.toUpperCase() !== 'TRUE';
