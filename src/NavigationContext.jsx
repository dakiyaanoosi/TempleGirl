import { createContext, useContext } from 'react';

/**
 * Provides the `navigateTo(path)` function to any descendant component
 * without requiring prop drilling or a `window` global side-channel.
 */
export const NavigationContext = createContext(null);

/**
 * Returns the `navigateTo` function from the nearest NavigationContext provider.
 * Must be called inside a component that is a descendant of <App>.
 */
export function useNavigation() {
  return useContext(NavigationContext);
}
