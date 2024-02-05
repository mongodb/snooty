import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Resizable } from 'react-resizable';
import { cx, css } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import useViewport from '../../hooks/useViewport';
import { theme } from '../../theme/docsTheme';
import useScreenSize from '../../hooks/useScreenSize';
import useStickyTopValues from '../../hooks/useStickyTopValues';
import InstruqtFrame from './InstruqtFrame';
import DrawerButtons from './DrawerButtons';

const labContainerStyle = css`
  background-color: ${palette.gray.dark3};
  // Keeping z-index same as chatbot modal
  z-index: 2000;
  position: fixed !important;
  bottom: 0;
  color: ${palette.white};

  @media ${theme.screenSize.upToSmall} {
    // Accommodate widget buttons
    bottom: 60px;
    // We need to lower z-index to avoid floating lab when top nav menus are open/active
    z-index: 0;
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

  const [height, setHeight] = useState(defaultHeight);
  const minHeight = 60;
  let maxHeight = viewportSize.height ?? defaultMeasurement;
  const { topSmall } = useStickyTopValues();

  if (isMobile) {
    // Avoids max height of drawer from being skewed by widgets
    const widgetsContainerHeight = theme.size.stripUnit(theme.widgets.buttonContainerMobileHeight);
    // Prevents the drawer from overlapping with the top nav, which helps avoid awkward z-indexes when
    // UnifiedNav's menu is open. We can consider removing this if either the UnifiedNav provides
    // some sort of way to allow the frontend to know if its menu is open, or if the lab drawer no longer
    // rests on top of the widgets container
    const topNavHeight = theme.size.stripUnit(topSmall);
    const offset = topNavHeight + widgetsContainerHeight;
    maxHeight -= offset;
  }

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
      <div style={{ width: wrapperWidth, height: height + 'px' }} data-testid="resizable-wrapper">
        <div className={cx(topContainerStyle)}>
          <div className={cx(titleStyle)}>{labTitle}</div>
          <DrawerButtons
            height={height}
            minHeight={minHeight}
            maxHeight={maxHeight}
            defaultHeight={defaultHeight}
            setHeight={setHeight}
          />
        </div>
        <InstruqtFrame title={title} embedValue={embedValue} height={frameHeight} />
      </div>
    </Resizable>,
    document.body
  );
};

export default LabDrawer;
