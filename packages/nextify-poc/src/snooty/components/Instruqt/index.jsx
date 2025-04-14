import React, { useContext } from 'react';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import LabDrawer from './LabDrawer';
import InstruqtFrame from './InstruqtFrame';
import { InstruqtContext } from './instruqt-context';

const Instruqt = ({ nodeData }) => {
  const embedValue = nodeData?.argument[0]?.value;
  const title = nodeData?.options?.title;
  const isDrawer = nodeData?.options?.drawer;
  const { isOpen } = useContext(InstruqtContext);
  const { darkMode } = useDarkMode();

  if (!embedValue) {
    return null;
  }

  return (
    <>
      {isDrawer ? (
        isOpen && (
          <>
            <LabDrawer darkMode={darkMode} embedValue={embedValue} title={title} />
          </>
        )
      ) : (
        <InstruqtFrame darkMode={darkMode} title={title} embedValue={embedValue} />
      )}
    </>
  );
};

export default Instruqt;
