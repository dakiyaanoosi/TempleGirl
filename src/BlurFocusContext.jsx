import { createContext, useContext } from 'react';

export const BlurFocusContext = createContext(null);

export function useBlurFocusNavigation() {
  return useContext(BlurFocusContext);
}
