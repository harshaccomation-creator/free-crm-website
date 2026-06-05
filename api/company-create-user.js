import { json } from './_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { ok: false, message: 'Method not allowed' });
  }
  return json(res, 501, {
    ok: false,
    message: 'Team member invite API setup pending. Team listing is safe to use.',
  });
}
