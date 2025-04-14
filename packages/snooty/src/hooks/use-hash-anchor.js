import { useEffect } from "react";
import { useLocation } from "../../gatsby-shim";

// Hook that scrolls the current ref element into view
// if it is the same as the current location's hash.
// This is required on elements with id attribute
// to overcome DOM tree being pushed down by rehydrated content
// ie. saved tabbed content from local storage
const useHashAnchor = (id, ref) => {
  const { hash } = useLocation();

  useEffect(() => {
    const hashId = hash?.slice(1);
    if (!hash || id !== hashId || !ref.current) {
      return;
    }
    setTimeout(() => {
      ref.current.scrollIntoView();
    }, 100);
  }, [hash, id, ref]);
};

export default useHashAnchor;
