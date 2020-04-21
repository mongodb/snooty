import { getSegmentUserId, sendAnalytics } from '../../src/utils/segment';

const knownUser = {
  id: jest.fn(() => 'test-id-please-ignore'),
  anonymousId: jest.fn(() => 'anonymous'),
};
const knownUserMock = jest.fn(() => knownUser);
const unknownUser = {
  id: jest.fn(),
  anonymousId: jest.fn(() => 'anonymous'),
};
const unknownUserMock = jest.fn(() => unknownUser);
const trackMock = jest.fn((eventName, eventObj) => ({ eventName, eventObj }));

describe('segment', () => {
  let windowSpy;
  beforeEach(() => {
    windowSpy = jest.spyOn(global, 'window', 'get');
  });
  function spyKnownUser() {
    windowSpy.mockImplementation(() => ({
      analytics: {
        user: knownUserMock,
        track: trackMock,
      },
    }));
  }
  function spyUnknownUser() {
    windowSpy.mockImplementation(() => ({
      analytics: {
        user: unknownUserMock,
        track: trackMock,
      },
    }));
  }
  afterEach(() => {
    windowSpy.mockRestore();
  });

  afterEach(() => {
    knownUser.id.mockClear();
    knownUser.anonymousId.mockClear();
    knownUserMock.mockClear();

    unknownUser.id.mockClear();
    unknownUser.anonymousId.mockClear();
    unknownUserMock.mockClear();

    trackMock.mockClear();
  });

  it("gets the current user's known Segment ID", () => {
    spyKnownUser();
    const { isAnonymous, id } = getSegmentUserId();
    expect(isAnonymous).toBe(false);
    expect(id).toBe('test-id-please-ignore');
  });

  it('generates an anonymous ID if the current user is unknown', () => {
    spyUnknownUser();
    const { isAnonymous, id } = getSegmentUserId();
    expect(isAnonymous).toBe(true);
    expect(id).toBe('anonymous');
  });

  it('tracks analytics events for the current user', () => {
    spyKnownUser();
    const eventObj = sendAnalytics('test', { value: 'test-value-please-ignore' });
    expect(eventObj).toEqual({
      segmentUID: 'test-id-please-ignore',
      value: 'test-value-please-ignore',
    });
    expect(knownUserMock.mock.calls).toHaveLength(1);
    expect(knownUser.id.mock.calls).toHaveLength(1);
    expect(trackMock.mock.calls).toHaveLength(1);
  });
});
