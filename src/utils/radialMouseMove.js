/**
 * Sets CSS custom properties --x and --y on the event target,
 * used for radial gradient hover effects on buttons.
 * @param {MouseEvent} e
 */
export const handleRadialMouseMove = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--x', `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty('--y', `${e.clientY - rect.top}px`);
};
