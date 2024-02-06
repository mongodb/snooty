import React, { useContext } from 'react';
import LabDrawer from './LabDrawer';
import InstruqtFrame from './InstruqtFrame';
import { InstruqtContext } from './instruqt-context';

const Instruqt = ({ nodeData }) => {
  const embedValue = nodeData?.argument[0]?.value;
  const title = nodeData?.options?.title;
  const { isOpen, hasDrawer } = useContext(InstruqtContext);

  if (!embedValue) {
    return null;
  }

  return (
    <>
      {hasDrawer ? (
        isOpen && (
          <>
            <LabDrawer embedValue={embedValue} title={title} />
          </>
        )
      ) : (
        <InstruqtFrame title={title} embedValue={embedValue} />
      )}
    </>
  );
};

export default Instruqt;
