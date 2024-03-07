console.log('env ', process.env.LHCI_BUILD_TOKEN);

module.exports = {
  ci: {
    collect: {
      staticDistDir: './public',
      startServerCommand: 'npm run serve',
      url: ['http://localhost:8080'],
    },
    upload: {
      target: 'lhci',
      serverBaseUrl: 'http://localhost:9001',
      token: '3695a47b-03b2-4bd0-9d9b-53039f3f9d51', // TODO: need to use env var
    },
  },
};
