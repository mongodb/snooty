// Placeholder functions for preview mode to work without crashing from gatsby functions
function useSiteMetadata() {
    return {
        title: "Breadcrumb"
    };
}

function withPrefix(str) {
    return "#";
}

module.exports = {
    withPrefix,
    useSiteMetadata
}
