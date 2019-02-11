import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import URIText from '../src/components/URIText';

describe('local MongoDB', () => {
  const templateType = 'local MongoDB'
  const uri = {
    authSource: 'admin',
    database: 'myDatabase',
    env: '',
    hostlist: {
      host0: 'cluster0-shard-00-00-igkvv.mongodb.net:27017',
      host1: 'cluster0-shard-00-01-igkvv.mongodb.net:27017',
      host2: 'cluster0-shard-00-02-igkvv.mongodb.net:27017',
    },
    replicaSet: '',
    ssl: '',
    username: 'myUsername',
  };

  describe('when called without a placeholder', () => {
    it('returns the original string', () => {
      const value = `This is the body text`;
      const tree = renderer
        .create(<URIText value={value} templateType={templateType} uri={uri} />)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('when there is a <URISTRNG> placeholder', () => {
    it('replaces the placeholder', () => {
      const value = `return MongoClient("<URISTRING>")`;
      const tree = renderer
        .create(<URIText value={value} templateType={templateType} uri={uri} />)
        .toJSON();
      expect(tree).toMatchSnapshot();
    })
  });

  describe('when there are multiple placeholders', () => {
    it('replaces all placeholders', () => {
      const value =
        `return MongoClient("<URISTRING>")
        username is <USERNAME>
        shell string (<URISTRING_SHELL>)
        without password (<URISTRING_SHELL_NOUSER>)`;
      const tree = renderer
        .create(<URIText value={value} templateType={templateType} uri={uri} />)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});

describe('local MongoDB with replica set', () => {
  const templateType = 'local MongoDB'
  const uri = {
    authSource: '',
    database: 'myDatabase',
    env: 'local MongoDB with replica set',
    hostlist: {
      host0: 'cluster0-shard-00-00-igkvv.mongodb.net:27017',
    },
    replicaSet: 'Cluster0-shard-8',
    ssl: '',
    username: 'myUsername',
  };

  describe('when called without a placeholder', () => {
    it('returns the original string', () => {
      const value = `This is the body text`;
      const tree = renderer
        .create(<URIText value={value} templateType={templateType} uri={uri} />)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('when there is a <URISTRNG> placeholder', () => {
    it('replaces the placeholder', () => {
      const value = `return MongoClient("<URISTRING>")`;
      const tree = renderer
        .create(<URIText value={value} templateType={templateType} uri={uri} />)
        .toJSON();
      expect(tree).toMatchSnapshot();
    })
  });

  describe('when there are multiple placeholders', () => {
    it('replaces all placeholders', () => {
      const value =
        `return MongoClient("<URISTRING>")
        username is <USERNAME>
        shell string (<URISTRING_SHELL>)
        without password (<URISTRING_SHELL_NOUSER>)`;
      const tree = renderer
        .create(<URIText value={value} templateType={templateType} uri={uri} />)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});

describe('Cloud (unspecified version)', () => {
  const templateType = 'Atlas (Cloud)'
  const uri = {
    authSource: 'admin',
    database: 'myDatabase',
    env: '',
    hostlist: {
      host0: 'cluster0-shard-00-00-igkvv.mongodb.net:27017',
    },
    replicaSet: 'Cluster0-shard-8',
    ssl: '',
    username: 'myUsername',
  };

  describe('when called without a placeholder', () => {
    it('returns the original string', () => {
      const value = `This is the body text`;
      const tree = renderer
        .create(<URIText value={value} templateType={templateType} uri={uri} />)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('when there is a <URISTRNG> placeholder', () => {
    it('replaces the placeholder', () => {
      const value = `return MongoClient("<URISTRING>")`;
      const tree = renderer
        .create(<URIText value={value} templateType={templateType} uri={uri} />)
        .toJSON();
      expect(tree).toMatchSnapshot();
    })
  });

  describe('when there are multiple placeholders', () => {
    it('replaces all placeholders', () => {
      const value =
        `return MongoClient("<URISTRING>")
        username is <USERNAME>
        shell string (<URISTRING_SHELL>)
        without password (<URISTRING_SHELL_NOUSER>)`;
      const tree = renderer
        .create(<URIText value={value} templateType={templateType} uri={uri} />)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});

describe('Cloud (MongoDB version 3.4)', () => {
  const templateType = 'Atlas (Cloud)'
  const uri = {
    authSource: 'admin',
    database: 'myDatabase',
    env: 'Atlas (Cloud) v. 3.4',
    hostlist: {
      host0: 'cluster0-shard-00-00-igkvv.mongodb.net:27017',
      host1: 'cluster0-shard-00-01-igkvv.mongodb.net:27017',
      host2: 'cluster0-shard-00-02-igkvv.mongodb.net:27017',
    },
    replicaSet: '',
    ssl: '',
    username: 'myUsername',
  };

  describe('when called without a placeholder', () => {
    it('returns the original string', () => {
      const value = `This is the body text`;
      const tree = renderer
        .create(<URIText value={value} templateType={templateType} uri={uri} />)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('when there is a <URISTRNG> placeholder', () => {
    it('replaces the placeholder', () => {
      const value = `return MongoClient("<URISTRING>")`;
      const tree = renderer
        .create(<URIText value={value} templateType={templateType} uri={uri} />)
        .toJSON();
      expect(tree).toMatchSnapshot();
    })
  });

  describe('when there are multiple placeholders', () => {
    it('replaces all placeholders', () => {
      const value =
        `return MongoClient("<URISTRING>")
        username is <USERNAME>
        shell string (<URISTRING_SHELL>)
        without password (<URISTRING_SHELL_NOUSER>)`;
      const tree = renderer
        .create(<URIText value={value} templateType={templateType} uri={uri} />)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
