import React from 'react';
import { shallow } from 'enzyme';
import URIText from '../../src/components/URIWriter/URIText';
import { DEPLOYMENTS } from '../../src/constants';
import {
  TEMPLATE_TYPE_ATLAS_34,
  TEMPLATE_TYPE_ATLAS_36,
  TEMPLATE_TYPE_SELF_MANAGED,
  TEMPLATE_TYPE_REPLICA_SET,
} from '../../src/components/URIWriter/constants';

const CLOUD_DEPLOYMENT = DEPLOYMENTS[0];
const LOCAL_DEPLOYMENT = DEPLOYMENTS[1];

describe('local MongoDB', () => {
  const activeDeployment = LOCAL_DEPLOYMENT;
  const uri = {
    authSource: 'admin',
    database: 'myDatabase',
    hostlist: [
      'cluster0-shard-00-00-igkvv.mongodb.net:27017',
      'cluster0-shard-00-01-igkvv.mongodb.net:27017',
      'cluster0-shard-00-02-igkvv.mongodb.net:27017',
    ],
    localEnv: TEMPLATE_TYPE_SELF_MANAGED,
    replicaSet: '',
    ssl: '',
    username: 'myUsername',
  };

  describe('when called without a placeholder', () => {
    it('returns the original string', () => {
      const value = 'This is the body text';
      const tree = shallow(<URIText value={value} activeDeployment={activeDeployment} uri={uri} />);
      expect(tree).toMatchSnapshot();
    });
  });

  describe('when there is a <URISTRNG> placeholder', () => {
    it('replaces the placeholder', () => {
      const value = 'return MongoClient("<URISTRING>")';
      const tree = shallow(<URIText value={value} activeDeployment={activeDeployment} uri={uri} />);
      expect(tree).toMatchSnapshot();
    });
  });

  describe('when there are multiple placeholders', () => {
    it('replaces all placeholders', () => {
      const value = `return MongoClient("<URISTRING>")
        username is <USERNAME>
        shell string (<URISTRING_SHELL>)
        without password (<URISTRING_SHELL_NOUSER>)`;
      const tree = shallow(<URIText value={value} activeDeployment={activeDeployment} uri={uri} />);
      expect(tree).toMatchSnapshot();
    });
  });
});

describe('local MongoDB with replica set', () => {
  const activeDeployment = LOCAL_DEPLOYMENT;
  const uri = {
    authSource: '',
    database: 'myDatabase',
    hostlist: ['cluster0-shard-00-00-igkvv.mongodb.net:27017'],
    localEnv: TEMPLATE_TYPE_REPLICA_SET,
    replicaSet: 'Cluster0-shard-8',
    ssl: '',
    username: 'myUsername',
  };

  describe('when called without a placeholder', () => {
    it('returns the original string', () => {
      const value = 'This is the body text';
      const tree = shallow(<URIText value={value} activeDeployment={activeDeployment} uri={uri} />);
      expect(tree).toMatchSnapshot();
    });
  });

  describe('when there is a <URISTRNG> placeholder', () => {
    it('replaces the placeholder', () => {
      const value = 'return MongoClient("<URISTRING>")';
      const tree = shallow(<URIText value={value} activeDeployment={activeDeployment} uri={uri} />);
      expect(tree).toMatchSnapshot();
    });
  });

  describe('when there are multiple placeholders', () => {
    it('replaces all placeholders', () => {
      const value = `return MongoClient("<URISTRING>")
        username is <USERNAME>
        shell string (<URISTRING_SHELL>)
        without password (<URISTRING_SHELL_NOUSER>)`;
      const tree = shallow(<URIText value={value} activeDeployment={activeDeployment} uri={uri} />);
      expect(tree).toMatchSnapshot();
    });
  });
});

describe('Cloud  (MongoDB version 3.6)', () => {
  const activeDeployment = CLOUD_DEPLOYMENT;
  const uri = {
    atlasVersion: TEMPLATE_TYPE_ATLAS_36,
    authSource: 'admin',
    database: 'myDatabase',
    hostlist: ['cluster0-shard-00-00-igkvv.mongodb.net:27017'],
    replicaSet: 'Cluster0-shard-8',
    ssl: '',
    username: 'myUsername',
  };

  describe('when called without a placeholder', () => {
    it('returns the original string', () => {
      const value = 'This is the body text';
      const tree = shallow(<URIText value={value} activeDeployment={activeDeployment} uri={uri} />);
      expect(tree).toMatchSnapshot();
    });
  });

  describe('when there is a <URISTRNG> placeholder', () => {
    it('replaces the placeholder', () => {
      const value = 'return MongoClient("<URISTRING>")';
      const tree = shallow(<URIText value={value} activeDeployment={activeDeployment} uri={uri} />);
      expect(tree).toMatchSnapshot();
    });
  });

  describe('when there are multiple placeholders', () => {
    it('replaces all placeholders', () => {
      const value = `return MongoClient("<URISTRING>")
        username is <USERNAME>
        shell string (<URISTRING_SHELL>)
        without password (<URISTRING_SHELL_NOUSER>)`;
      const tree = shallow(<URIText value={value} activeDeployment={activeDeployment} uri={uri} />);
      expect(tree).toMatchSnapshot();
    });
  });
});

describe('Cloud (MongoDB version 3.4)', () => {
  const activeDeployment = CLOUD_DEPLOYMENT;
  const uri = {
    atlasVersion: TEMPLATE_TYPE_ATLAS_34,
    authSource: 'admin',
    database: 'myDatabase',
    hostlist: [
      'cluster0-shard-00-00-igkvv.mongodb.net:27017',
      'cluster0-shard-00-01-igkvv.mongodb.net:27017',
      'cluster0-shard-00-02-igkvv.mongodb.net:27017',
    ],
    replicaSet: '',
    ssl: '',
    username: 'myUsername',
  };

  describe('when called without a placeholder', () => {
    it('returns the original string', () => {
      const value = 'This is the body text';
      const tree = shallow(<URIText value={value} activeDeployment={activeDeployment} uri={uri} />);
      expect(tree).toMatchSnapshot();
    });
  });

  describe('when there is a <URISTRNG> placeholder', () => {
    it('replaces the placeholder', () => {
      const value = 'return MongoClient("<URISTRING>")';
      const tree = shallow(<URIText value={value} activeDeployment={activeDeployment} uri={uri} />);
      expect(tree).toMatchSnapshot();
    });
  });

  describe('when there are multiple placeholders', () => {
    it('replaces all placeholders', () => {
      const value = `return MongoClient("<URISTRING>")
        username is <USERNAME>
        shell string (<URISTRING_SHELL>)
        without password (<URISTRING_SHELL_NOUSER>)`;
      const tree = shallow(<URIText value={value} activeDeployment={activeDeployment} uri={uri} />);
      expect(tree).toMatchSnapshot();
    });
  });
});
