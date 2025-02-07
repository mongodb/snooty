# variables that need to be changed based on the content repo you're working on -------------------------------------------
TESTING_ORGANIZATION=$1 # name of org, usually mongodb or 10gen
TESTING_REPO_NAME=$2 # name of content repo
TESTING_BRANCH_NAME=$3 # name of the branch
PARSER_VERSION=$4 # version of the parser to download
# -------------------------------------------------------------------------------------------------------------------------

# This make command curls the examples for certain repos.
# If the rule doesn't exist, the error doesn't interrupt the build process.
# make examples - we don't need this for docs-landing, but have it here for when we change repos

# cloning the content repo
echo "Cloning content repo: ${TESTING_REPO_NAME}"
git clone -b ${TESTING_BRANCH_NAME} https://github.com/${TESTING_ORGANIZATION}/${TESTING_REPO_NAME}.git 



# running the parser 
if [ ! -d "snooty-parser" ]; then
  echo "Snooty parser not installed, downloading parser version $PARSER_VERSION ..."
  curl -L -o snooty-parser.zip https://github.com/mongodb/snooty-parser/releases/download/v${PARSER_VERSION}/snooty-v${PARSER_VERSION}-linux_x86_64.zip
  unzip -d ./snooty-parser snooty-parser.zip
  chmod +x ./snooty-parser/snooty
fi

echo "======================================================================================================================================================================="
echo "========================================================================== Running parser... =========================================================================="
./snooty-parser/snooty/snooty build $(pwd)/${TESTING_REPO_NAME}  --output=./bundle.zip --branch=master
echo "========================================================================== Parser complete ============================================================================"
echo "======================================================================================================================================================================="

# putting set conent-repo as the path
echo GATSBY_MANIFEST_PATH=$(pwd)/bundle.zip
export GATSBY_MANIFEST_PATH=$(pwd)/bundle.zip

# run the site
npm run build:no-prefix
