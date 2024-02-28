import { callPostBuildWebhook } from '../../plugins/gatsby-source-snooty-preview/utils/post-build';
import { constructResPayload } from '../utils';

export async function handler(event, _context) {
  const resPayload = constructResPayload(event);
  await callPostBuildWebhook(resPayload, 'completed');
}
