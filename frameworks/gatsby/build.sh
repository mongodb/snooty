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


echo Beginning build step
