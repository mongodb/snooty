export const elementZIndex = {
  setZIndex: (selector, zIndex) => {
    const ele = document.querySelector(selector);

    if (!ele) {
      console.error('selector not found');
      return;
    }

    if (typeof zIndex !== 'number') {
      console.error('z-index value has to be a number');
      return;
    }

    document.querySelector(selector).style.zIndex = zIndex;
  },
  resetZIndex: (selector) => {
    const ele = document.querySelector(selector);

    if (!ele) {
      console.error('selector not found');
      return;
    }

    ele.style.zIndex = 0;
  },
};
