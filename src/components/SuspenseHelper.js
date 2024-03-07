import { useEffect, useState, Suspense } from 'react';

/* Helper to avoid React minified errors. Compiles fallback component into the static HTML pages. */
export const SuspenseHelper = ({ fallback, children }) => {
  const [isMounted, setMounted] = useState(false);

  useEffect(() => {
    if (!isMounted) {
      setMounted(true);
    }
  }, [isMounted]);

  return <Suspense fallback={fallback}>{!isMounted ? fallback : children}</Suspense>;
};
