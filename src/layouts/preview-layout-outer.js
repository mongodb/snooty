import React from 'react';
import { NavigationProvider } from '../context/navigation-context';

const PreviewLayoutOuter = ({ children, pageContext: { project } }) => {
  return <NavigationProvider project={project}>{children}</NavigationProvider>;
};

export default PreviewLayoutOuter;
