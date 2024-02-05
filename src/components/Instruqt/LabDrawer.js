import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Resizable } from 'react-resizable';
import { cx, css } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import useViewport from '../../hooks/useViewport';
import { theme } from '../../theme/docsTheme';
import useScreenSize from '../../hooks/useScreenSize';
import InstruqtFrame from './InstruqtFrame';
import DrawerButtons from './DrawerButtons';

const labContainerStyle = css`
  background-color: ${palette.gray.dark3};
  z-index: 2000;
  position: fixed !important;
  bottom: 0;
  color: ${palette.white};

  @media ${theme.screenSize.upToSmall} {
    // Accommodate widget buttons
    bottom: 60px;
  }
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
  position: relative;
  padding: 0 17px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media ${theme.screenSize.upToMedium} {
    justify-content: left;
  }
`;

const titleStyle = css`
  font-size: 16px;
  line-height: 28px;
  width: 50vw;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  margin-top: 10px;

  @media ${theme.screenSize.upToMedium} {
    text-align: left;
    margin-top: 0;
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
  const { isMobile } = useScreenSize();
  const labTitle = title || 'MongoDB Interactive Lab';

  const defaultMeasurement = 200;
  const defaultHeight = (viewportSize.height * 2) / 3 ?? defaultMeasurement;
  const defaultWidth = viewportSize.width ?? defaultMeasurement;
  // Set this to 100% instead of a set px to avoid overlap with the browser's scrollbar
  const wrapperWidth = '100%';

  const minHeight = 60;
  let maxHeight = viewportSize.height ?? defaultMeasurement;
  // Subtract additional 60px to accommodate widget buttons
  if (isMobile) maxHeight -= 60;
  const [height, setHeight] = useState(defaultHeight);

  const frameHeight = height - minHeight;
  const isMinHeight = height === minHeight;
  const buttonTargetHeight = isMinHeight ? defaultHeight : minHeight;

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
      <div style={{ width: wrapperWidth, height: height + 'px' }} data-testid="resizable-wrapper">
        <div className={cx(topContainerStyle)}>
          <div className={cx(titleStyle)}>{labTitle}</div>
          <DrawerButtons
            isMinHeight={isMinHeight}
            targetHeight={buttonTargetHeight}
            setHeight={setHeight}
            maxHeight={maxHeight}
          />
        </div>
        <InstruqtFrame title={title} embedValue={embedValue} height={frameHeight} />
      </div>
    </Resizable>,
    document.body
  );
};

export default LabDrawer;
