# variables that need to be changed based on the content repo you're working on -------------------------------------------
TESTING_CONTENT_REPO=docs-landing # name of content repo
ORGANIZATION=mongodb # name of org, usually mongodb or 10gen
# -------------------------------------------------------------------------------------------------------------------------
PARSER_VERSION=0.18.0

# This make command curls the examples for certain repos.
# If the rule doesn't exist, the error doesn't interrupt the build process.
# make examples - we don't need this for docs-landing, but have it here for when we change repos

# cloning the content repo
echo "building docs-landing (temp, bianca's fork)"
git clone https://github.com/${ORGANIZATION}/${TESTING_CONTENT_REPO}.git


# running the parser 
if [ ! -d "snooty-parser" ]; then
  echo "snooty parser not installed, downloading..."
  curl -L -o snooty-parser.zip https://github.com/mongodb/snooty-parser/releases/download/v${PARSER_VERSION}/snooty-v${PARSER_VERSION}-linux_x86_64.zip
  unzip -d ./snooty-parser snooty-parser.zip
  chmod +x ./snooty-parser/snooty
fi

echo "======================================================================================================================================================================="
echo "========================================================================== Running parser... =========================================================================="
./snooty-parser/snooty/snooty build $(pwd)/${TESTING_CONTENT_REPO} --output=./bundle.zip
echo "========================================================================== Parser complete ============================================================================"
echo "======================================================================================================================================================================="

# putting set conent-repo as the path
echo GATSBY_MANIFEST_PATH=$(pwd)/bundle.zip
export GATSBY_MANIFEST_PATH=$(pwd)/bundle.zip

# run the site
npm run build:no-prefix
