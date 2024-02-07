module.exports = {
  ci: {
    collect: {
      staticDistDir: './public',
      startServerCommand: 'npm run serve',
      url: ['http://localhost:9001'],
    },
    upload: {
      target: 'lhci',
      serverBaseUrl: 'http://localhost:3000',
      token: '6a951bec-1f0a-4845-870e-78050e29e3e0', // could also use LHCI_TOKEN variable instead
    },
  },
};
