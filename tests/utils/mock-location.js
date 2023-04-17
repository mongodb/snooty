import * as reachRouter from '@reach/router';

export const mockLocation = (search) => jest.spyOn(reachRouter, 'useLocation').mockImplementation(() => ({ search }));
