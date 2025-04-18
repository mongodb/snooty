#/bin/bash

# Gatsby occasionally randomly fails with: "Failed to write page-data for ...
# Couldn't find temp query result for ...". This appears to be a race condition
# with LMDB usage and there is no apparent fix for it. See
# https://github.com/gatsbyjs/gatsby/issues/35018 . As a workaround, we build in
# this script and catch failure.

cd "$(dirname "$0")"

# Temp file for capturing output
OUTPUT_TEMP_FILE=$(mktemp)

# First build attempt
npm run build:no-retry -- $1 2>&1 | tee "$OUTPUT_TEMP_FILE"
EXIT_CODE=${PIPESTATUS[0]}

# Build succeeded?
if [ $EXIT_CODE -eq 0 ]; then
  rm -f "$OUTPUT_TEMP_FILE"
  exit $EXIT_CODE
fi

# Build failed! Retry?
if grep -q "temp query result" "$OUTPUT_TEMP_FILE"; then
  echo "Build failed with 'temp query result' error! Clearing LMDB cache and retrying build..."
  rm -rf .cache/caches-lmdb/
  rm -f "$OUTPUT_TEMP_FILE"
  npm run build:no-retry
  exit $?
fi

echo "Build failed, but with the 'temp query result' error."
# Clean up and exit with original non-zero code
rm -f "$OUTPUT_TEMP_FILE"
exit $EXIT_CODE
