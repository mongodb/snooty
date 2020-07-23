import { useEffect } from 'react';

/**
 * This hook fires an onClickOutside handler if the given node ref is clicked
 * outside of or the escape key is pressed
 * @param {*} ref a node which we will fire the onClickOutside handler if clicked
 * outside of
 * @param {*} onClickOutside a callback handler
 */
export const useClickOutside = (ref, onClickOutside) => {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside();
      }
    }
    function handleEscape(event) {
      event = event || window.event;
      if (event.key === 'Escape') {
        onClickOutside();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    // Cannot handle ESC on FF https://bugzilla.mozilla.org/show_bug.cgi?id=1443758
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClickOutside, ref]);
};
