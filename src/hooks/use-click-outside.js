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
      if (event.keyCode == 27) {
        onClickOutside();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClickOutside, ref]);
};
