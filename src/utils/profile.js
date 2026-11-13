// Check profile details and skill levels.

import { DEMO_SEED, MAYA_PROFILE } from '../data/demo.js';



export const isDemoUser = (u) => !!u && u.name === MAYA_PROFILE.name && !('institute' in u);

export const getLevel = (user, stored, skill) => (stored && stored[skill]) || (isDemoUser(user) ? (DEMO_SEED[skill] || 'self') : 'self');

export function profileHasDetails(user) {
  return !!(user && (user.headline || user.about || (Array.isArray(user.languages) && user.languages.length) || user.availability || user.rateNote || (Array.isArray(user.tools) && user.tools.length) || (Array.isArray(user.training) && user.training.some(x => x && x.title))));
}
