const isExternalUrl = /^(http(s)?:\/\/|mailto:)/;

const isDocsUrl = /^http(s)?:\/\/docs.(atlas.|cloudmanager.|opsmanager.)?mongodb.com/;

export const isInternalUrl = (to) => (isExternalUrl.test(to) ? isDocsUrl.test(to) : true);
