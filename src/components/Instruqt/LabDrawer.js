import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Resizable } from 'react-resizable';
import { cx, css } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import useViewport from '../../hooks/useViewport';
import { theme } from '../../theme/docsTheme';
import InstruqtFrame from './InstruqtFrame';

const labContainerStyle = css`
  background-color: ${palette.gray.dark3};
  z-index: 9999;
  position: fixed !important;
  bottom: 0;
  padding-top: 21px;
  color: ${palette.white};
`;

const handleContainerStyle = css`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const handleStyle = css`
  position: absolute;
  border-radius: 4px;
  cursor: ns-resize;
  top: 10px;
  background-color: ${palette.white};
  width: 50px;
  height: 4px;

  @media ${theme.screenSize.upToMedium} {
    display: none;
  }
`;

const topContainerStyle = css`
  margin-bottom: 11px;
  padding-left: 17px;
  height: 28px;
  display: flex;
  justify-content: center;

  @media ${theme.screenSize.upToSmall} {
    display: block;
  }
`;

const titleStyle = css`
  line-height: 28px;
  width: 50vw;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;

  @media ${theme.screenSize.upToSmall} {
    text-align: left;
  }
`;

const CustomResizeHandle = React.forwardRef((props, ref) => {
  const { handleAxis, ...restProps } = props;
  return (
    <div className={cx(handleContainerStyle)}>
      <div className={cx(handleStyle)} ref={ref} {...restProps} />
    </div>
  );
});

const LabDrawer = ({ title, embedValue }) => {
  const viewportSize = useViewport();
  const labTitle = title || 'MongoDB Interactive Lab';

  const defaultMeasurement = 200;
  const defaultWidth = viewportSize.width ?? defaultMeasurement;
  const defaultHeight = (viewportSize.height * 2) / 3 ?? defaultMeasurement;

  const minHeight = 60;
  const maxHeight = viewportSize.height ?? defaultMeasurement;
  const [height, setHeight] = useState(defaultHeight);

  const frameHeight = height - minHeight;

  // Shrink height of the drawer if new max height is less than the current height
  useEffect(() => {
    if (maxHeight < height) {
      setHeight(maxHeight);
    }
  }, [height, maxHeight]);

  const handleResize = (_e, { size }) => {
    setHeight(size.height);
  };

  return createPortal(
    <Resizable
      className={cx(labContainerStyle)}
      height={height}
      maxConstraints={[defaultWidth, maxHeight]}
      minConstraints={[defaultWidth, minHeight]}
      width={defaultWidth}
      resizeHandles={['n']}
      handle={<CustomResizeHandle />}
      onResize={handleResize}
    >
      {/* Need this div with style as a wrapper to help with resizing */}
      <div style={{ width: defaultWidth + 'px', height: height + 'px' }}>
        <div className={cx(topContainerStyle)}>
          <div className={cx(titleStyle)}>{labTitle}</div>
        </div>
        <InstruqtFrame title={title} embedValue={embedValue} height={frameHeight} />
      </div>
    </Resizable>,
    document.body
  );
};

export default LabDrawer;
