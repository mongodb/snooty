#!/bin/bash

# Gatsby occasionally randomly fails with: "Failed to write page-data for ...
# Couldn't find temp query result for ...". This appears to be a race condition
# with LMDB usage and there is no apparent fix for it. See
# https://github.com/gatsbyjs/gatsby/issues/35018 . As a workaround, we build in
# this script and catch failure.

cd "$(dirname "$0")"

for i in {1..3}; do
  echo "Build attempt $i."

  OUTPUT_TEMP_FILE=$(mktemp)
  # $1 may be --prefix-paths
  node ./node_modules/gatsby/cli.js build $1 2>&1 | tee "$OUTPUT_TEMP_FILE"
  EXIT_CODE=${PIPESTATUS[0]}

  # Build succeeded?
  if [ $EXIT_CODE -eq 0 ]; then
    rm -f "$OUTPUT_TEMP_FILE"
    exit $EXIT_CODE
  fi

  # Build failed! Retry?
  if ! grep -q "temp query result" "$OUTPUT_TEMP_FILE" && \
     ! grep -q "parallel query running" "$OUTPUT_TEMP_FILE"; then
    echo "Build failed, but not with the 'temp query result' error. Not retrying."
    # Clean up and exit with original non-zero code
    rm -f "$OUTPUT_TEMP_FILE"
    exit $EXIT_CODE
  fi

  echo "Build failed with 'temp query result' or with 'parallel query running' error! Clearing LMDB cache."
  rm -rf .cache/caches-lmdb/
  rm -f "$OUTPUT_TEMP_FILE"
done

echo "Build failed 3 times with 'temp query result' or 'parallel query running' error. Giving up."
exit 1
