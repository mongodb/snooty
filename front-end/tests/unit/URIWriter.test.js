import React from 'react';
import { mount } from 'enzyme';
import { DEPLOYMENTS } from '../../src/constants';
import URIWriter from '../../src/components/URIWriter';

const CLOUD_DEPLOYMENT = DEPLOYMENTS[0].name;
const LOCAL_DEPLOYMENT = DEPLOYMENTS[1].name;

const mountURIWriter = ({ activeDeployment, mockCallback }) =>
  mount(<URIWriter activeDeployment={activeDeployment} handleUpdateURIWriter={mockCallback} />);

const emptyCloudURI = {
  authSource: '',
  database: '',
  env: 'cloud',
  hostlist: {
    host0: '',
  },
  replicaSet: '',
  ssl: '',
  username: '',
};

describe('URIWriter', () => {
  describe('with a local MongoDB', () => {
    let wrapper;
    const mockCallback = jest.fn();

    beforeAll(() => {
      wrapper = mountURIWriter({ mockCallback, activeDeployment: LOCAL_DEPLOYMENT });
    });

    it('sets the env state to be local MongoDB', () => {
      expect(wrapper.state().env).toBe('local');
    });

    it('does not show an error', () => {
      expect(wrapper.find('.mongodb-form__status--invalid').exists()).toEqual(false);
    });

    it('does not display an input for replica sets', () => {
      const replicaSetInput = wrapper.find("input[name='replicaSet']");
      expect(replicaSetInput).toHaveLength(0);
    });

    it('updates username state when input is filled in', () => {
      const usernameValue = 'usernameTest';
      const usernameInput = wrapper.find("input[name='username']");
      usernameInput.instance().value = usernameValue;
      usernameInput.simulate('change');
      expect(wrapper.state().username).toBe(usernameValue);
    });

    it('updates database state when input is filled in', () => {
      const databaseValue = 'testDB';
      const databaseInput = wrapper.find("input[name='database']");
      databaseInput.instance().value = databaseValue;
      databaseInput.simulate('change');
      expect(wrapper.state().database).toBe(databaseValue);
    });

    it('updates authSource state when input is filled in', () => {
      const authSourceValue = 'testAuthSource';
      const authSourceInput = wrapper.find("input[name='authSource']");
      authSourceInput.instance().value = authSourceValue;
      authSourceInput.simulate('change');
      expect(wrapper.state().authSource).toBe(authSourceValue);
    });

    it('calls the callback function three times', () => {
      expect(mockCallback.mock.calls.length).toBe(3);
    });

    it('has one input field for hosts', () => {
      const host0Input = wrapper.find("input[name='host0']");
      const host1Input = wrapper.find("input[name='host1']");
      expect(host0Input).toHaveLength(1);
      expect(host1Input).toHaveLength(0);
    });

    it('adds an input field when a host is added', () => {
      const host0Input = wrapper.find("input[name='host0']");
      host0Input.instance().value = 'testing';
      host0Input.simulate('change');
      const host1Input = wrapper.find("input[name='host1']");
      expect(host1Input).toHaveLength(1);
    });

    it('shows pills to select a replica set', () => {
      expect(wrapper.find('.guide__pills').length).toBe(1);
    });

    it('has local MongoDB selected as the active pill', () => {
      expect(wrapper.find('.guide__pill--active').text()).toEqual('Local MongoDB');
    });

    describe('when replica set is selected', () => {
      beforeAll(() => {
        const replicaSetPill = wrapper.find('#local-MongoDB-with-replica-set');
        replicaSetPill.simulate('click');
      });

      it('displays an input for replica sets', () => {
        const replicaSetInput = wrapper.find("input[name='replicaSet']");
        expect(replicaSetInput).toHaveLength(1);
      });

      it('sets the env state to be local MongoDB with replica set', () => {
        expect(wrapper.state().env).toBe('local MongoDB with replica set');
      });
    });

    describe('when updated with invalid host inputs', () => {
      beforeAll(() => {
        wrapper = mountURIWriter({ mockCallback, activeDeployment: LOCAL_DEPLOYMENT });
      });

      it('has one input field for hosts', () => {
        const host0Input = wrapper.find("input[name='host0']");
        const host1Input = wrapper.find("input[name='host1']");
        expect(host0Input).toHaveLength(1);
        expect(host1Input).toHaveLength(0);
      });

      it('updates state when forms are filled in', () => {
        const hostValue = 'invalid';
        const hostInput = wrapper.find("input[name='host0']");
        hostInput.instance().value = hostValue;
        hostInput.simulate('change');
        expect(wrapper.state().hostlist.host0).toBe(hostValue);
      });

      it('shows an error', () => {
        expect(wrapper.find('.mongodb-form__status--invalid').length).toBe(1);
      });
    });
  });

  describe('with an Atlas cluster', () => {
    let wrapper;
    let mockCallback;

    beforeAll(() => {
      mockCallback = jest.fn();
      wrapper = mountURIWriter({ mockCallback, activeDeployment: CLOUD_DEPLOYMENT });
    });

    it('displays no input elements', () => {
      const inputs = wrapper.find('input');
      expect(inputs).toHaveLength(0);
    });

    it('displays one textarea element', () => {
      const textareas = wrapper.find('textarea');
      expect(textareas).toHaveLength(1);
    });

    describe('when a MongoDB 3.4 string is entered', () => {
      beforeAll(() => {
        mockCallback.mockClear();
      });

      it('parses the string correctly', () => {
        const inputString =
          'mongodb://myUsername:myPassword@cluster0-shard-00-00-juau5.mongodb.net:27017,cluster0-shard-00-01-juau5.mongodb.net:27017,cluster0-shard-00-02-juau5.mongodb.net:27017/myDatabaseName?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';
        const atlasTextarea = wrapper.find("textarea[name='atlas']");
        atlasTextarea.instance().value = inputString;
        atlasTextarea.simulate('change');

        const state = wrapper.state();
        expect(state.username).toBe('myUsername');
        expect(state.database).toBe('myDatabaseName');
        expect(state.authSource).toBe('admin');
        expect(state.replicaSet).toBe('Cluster0-shard-0');
        expect(state.hostlist).toEqual({
          host0: 'cluster0-shard-00-00-juau5.mongodb.net:27017',
          host1: 'cluster0-shard-00-01-juau5.mongodb.net:27017',
          host2: 'cluster0-shard-00-02-juau5.mongodb.net:27017',
        });
      });

      it('calls the callback function once', () => {
        expect(mockCallback.mock.calls.length).toBe(1);
      });
    });

    describe('when a MongoDB 3.6 string is entered', () => {
      beforeAll(() => {
        mockCallback.mockClear();
      });

      it('parses the string correctly', () => {
        const inputString = 'mongodb+srv://myUsername2:myPassword2@cluster0-juau5.mongodb.net/myDatabaseName2?';
        const atlasTextarea = wrapper.find("textarea[name='atlas']");
        atlasTextarea.instance().value = inputString;
        atlasTextarea.simulate('change');

        const state = wrapper.state();
        expect(state.username).toBe('myUsername2');
        expect(state.database).toBe('myDatabaseName2');
        expect(state.authSource).toBe('');
        expect(state.replicaSet).toBe('');
        expect(state.hostlist).toEqual({
          host0: 'cluster0-juau5.mongodb.net',
        });
      });

      it('calls the callback function once', () => {
        expect(mockCallback.mock.calls.length).toBe(1);
      });
    });

    describe('when a shell string is entered', () => {
      beforeAll(() => {
        mockCallback.mockClear();
      });

      it('parses the string correctly', () => {
        const inputString =
          'mongo "mongodb://cluster0-shard-00-00-igkvv.mongodb.net:27017,cluster0-shard-00-01-igkvv.mongodb.net:27017,cluster0-shard-00-02-igkvv.mongodb.net:27017/myDatabaseName3?replicaSet=Cluster0-shard-8" --ssl --authenticationDatabase admin3 --username myUsername3 --password myPassword3';
        const atlasTextarea = wrapper.find("textarea[name='atlas']");
        atlasTextarea.instance().value = inputString;
        atlasTextarea.simulate('change');

        const state = wrapper.state();
        expect(state.username).toBe('myUsername3');
        expect(state.database).toBe('myDatabaseName3');
        expect(state.authSource).toBe('admin3');
        expect(state.replicaSet).toBe('Cluster0-shard-8');
        expect(state.hostlist).toEqual({
          host0: 'cluster0-shard-00-00-igkvv.mongodb.net:27017',
          host1: 'cluster0-shard-00-01-igkvv.mongodb.net:27017',
          host2: 'cluster0-shard-00-02-igkvv.mongodb.net:27017',
        });
      });

      it('calls the callback function twice', () => {
        expect(mockCallback.mock.calls.length).toBe(2);
      });
    });

    describe('when an invalid string is entered', () => {
      beforeAll(() => {
        mockCallback.mockClear();
      });

      it('updates the state', () => {
        const inputString = 'invalid string';
        const atlasTextarea = wrapper.find("textarea[name='atlas']");
        atlasTextarea.instance().value = inputString;
        atlasTextarea.simulate('change');
        expect(wrapper.state().atlas).toBe(inputString);
      });

      it('has an empty uri state', () => {
        const state = wrapper.state();
        delete state.atlas;
        delete state.prevPropsActiveDeployment;
        expect(state).toEqual(emptyCloudURI);
      });

      it('calls the callback function once', () => {
        expect(mockCallback.mock.calls.length).toBe(1);
      });

      it('shows an error', () => {
        expect(wrapper.find('.mongodb-form__status--invalid').length).toBe(1);
      });
    });
  });
});
