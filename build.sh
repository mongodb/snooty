PARSER_VERSION=0.17.0

# This make command curls the examples for certain repos.
# If the rule doesn't exist, the error doesn't interrupt the build process.
# make examples - we don't need this for docs-landing, but have it here for when we change repos



echo "building docs-landing (temp, bianca's fork)"
git clone https://github.com/biancalaube/docs-landing.git


# running the parser 
if [ ! -d "snooty-parser" ]; then
  echo "snooty parser not installed, downloading..."
  curl -L -o snooty-parser.zip https://github.com/mongodb/snooty-parser/releases/download/v${PARSER_VERSION}/snooty-v${PARSER_VERSION}-linux_x86_64.zip
  unzip -d ./snooty-parser snooty-parser.zip
  chmod +x ./snooty-parser/snooty
fi

echo "======================================================================================================================================================================="
echo "========================================================================== Running parser... =========================================================================="
./snooty-parser/snooty/snooty build $(pwd)/docs-landing --output=./bundle.zip
#  snooty build path-to-repo/cloud-docs --output=bundle.zip
echo "========================================================================== Parser complete ============================================================================"
echo "======================================================================================================================================================================="

# putting docs-landing as the path
echo GATSBY_MANIFEST_PATH=$(pwd)/bundle.zip
echo GATSBY_SITE=landing
# do i need to set anymore variables

# run the site
npm run build

# make sure correct npm version ? 