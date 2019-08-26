// Placeholder functions for preview mode to work without crashing from gatsby functions
function useSiteMetadata() {
    return {
        title: "Breadcrumb"
    };
}

function withPrefix(str) {
    // Allows users to click on internal links without unnecessary page jumping or refreshing
    return "#!";
}

module.exports = {
    withPrefix,
    useSiteMetadata
}
