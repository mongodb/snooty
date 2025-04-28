# variables that need to be changed based on the content repo you're working on -------------------------------------------
TESTING_REPO_NAME=$1 # name of content repo
PARSER_VERSION=$2 # version of the parser to download
# -------------------------------------------------------------------------------------------------------------------------

# Check that content repo has been successfully cloned
if [ -d "${TESTING_REPO_NAME}" ]; then
  echo "Directory ${TESTING_REPO_NAME} exists"
else
  echo "Content repository directory for ${TESTING_REPO_NAME} does not exist, parse and build will fail"
fi

# running the parser 
if [ ! -d "snooty-parser" ]; then
  echo "Snooty parser not installed, downloading parser version $PARSER_VERSION ..."
  curl -L -o snooty-parser.zip https://github.com/mongodb/snooty-parser/releases/download/v${PARSER_VERSION}/snooty-v${PARSER_VERSION}-linux_x86_64.zip
  unzip -d ./snooty-parser snooty-parser.zip
  chmod +x ./snooty-parser/snooty
fi

echo "======================================================================================================================================================================="
echo "========================================================================== Running parser... =========================================================================="
./snooty-parser/snooty/snooty build $(pwd)/${TESTING_REPO_NAME} --no-caching --output=./bundle.zip
echo "========================================================================== Parser complete ============================================================================"
echo "======================================================================================================================================================================="

# putting set conent-repo as the path
echo GATSBY_MANIFEST_PATH=$(pwd)/bundle.zip
export GATSBY_MANIFEST_PATH=$(pwd)/bundle.zip

if [ -d "docs-worker-pool" ]; then
  node --unhandled-rejections=strict docs-worker-pool/modules/persistence/dist/index.js --path bundle.zip --githubUser netlify
fi

# run the site
npm run build
