/**
 * Centralized Route Registry and Matching Helper
 * Replaces duplicated hardcoded string logic across App, Header, Footer, and Transitions.
 */

export const ROUTES = {
  HOME: '/',
  CONTACT: '/contact',
  PRIVACY: '/privacy-policy',
  WEBSITE_PRIVACY: '/website-privacy',
  DELETE_ACCOUNT: '/delete-account',
  TERMS: '/terms',
  REFUND: '/refund',
  MANAGE_SUBSCRIPTION: '/manage-subscription',
};

const ROUTE_ALIASES = {
  [ROUTES.CONTACT]: ['/contact', '/pages/contact.html'],
  [ROUTES.PRIVACY]: ['/privacy-policy', '/privacy', '/pages/privacy.html'],
  [ROUTES.WEBSITE_PRIVACY]: ['/website-privacy', '/pages/website-privacy.html'],
  [ROUTES.DELETE_ACCOUNT]: ['/delete-account', '/pages/account-deletion.html'],
  [ROUTES.TERMS]: ['/terms', '/pages/terms.html'],
  [ROUTES.REFUND]: ['/refund', '/pages/refund.html'],
  [ROUTES.MANAGE_SUBSCRIPTION]: ['/manage-subscription', '/pages/manage-subscription', '/pages/manage-subscription.html'],
};

/**
 * Checks if currentPath matches a registered target route or any of its legacy aliases.
 * @param {string} currentPath
 * @param {string} targetRoute
 * @returns {boolean}
 */
export function isRouteActive(currentPath, targetRoute) {
  if (!currentPath) return false;
  if (targetRoute === ROUTES.HOME) {
    return currentPath === '/' || currentPath === '' || currentPath.endsWith('/index.html');
  }

  const aliases = ROUTE_ALIASES[targetRoute] || [targetRoute];
  return aliases.some((alias) => currentPath === alias || currentPath.endsWith(alias));
}
