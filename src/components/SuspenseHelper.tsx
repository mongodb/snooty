import React, { useEffect, useState, Suspense } from 'react';

interface SuspenseHelperProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
}

/* Helper to avoid React minified errors. Compiles fallback component into the static HTML pages. */
export const SuspenseHelper = ({ fallback, children }: SuspenseHelperProps) => {
  const [isMounted, setMounted] = useState(false);

  useEffect(() => {
    if (!isMounted) {
      setMounted(true);
    }
  }, [isMounted]);

  return <Suspense fallback={fallback}>{!isMounted ? fallback : children}</Suspense>;
};
