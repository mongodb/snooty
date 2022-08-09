import React, { useCallback, useState, useEffect, useRef } from 'react';
import { css } from '@emotion/react';
import { withPrefix } from 'gatsby-link';
import Button from '@leafygreen-ui/button';
import Icon from '@leafygreen-ui/icon';
import Portal from '@leafygreen-ui/portal';
import { palette } from '@leafygreen-ui/palette';
import Tooltip from './LeafygreenTooltip';
// TODO: make sure to replace these icons with LG icons later
import { CameraIcon, SpinnerIcon, CheckIcon } from '../icons';
import useScreenshot from '../hooks/useScreenshot';
import { isBrowser } from '../../../../utils/is-browser';

// this will be the styling for the "instruction screen".
const instructionScreenStyling = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
  border: #ffdd49 solid 10px;
  z-index: 101;
  cursor: pointer;
`;

const baseStyle = (position, top, left, width, height) => css`
  position: ${position}; /* Sit on top of the page content */
  top: ${top}px;
  left: ${left}px;
  width: ${width ? width + 'px' : `100%`};
  height: ${height}px;
  cursor: pointer; /* Add a pointer on hover */
`;

const overlayElementStyle = (position, top, left, width, height) => css`
  ${baseStyle(position, top, left, width, height)};
  background-color: rgba(0, 0, 0, 0.3); /* Black background with opacity */
  display: block; /* Hidden by default */
  z-index: 100;
`;

const hightlightedElementStyle = (position, top, left, width, height, lineStyle) => css`
  ${baseStyle(position, top, left, width, height)};
  outline: #ffdd49 ${lineStyle} 10px;
  outline-offset: 10px;
  z-index: 102;
  float: left;
  display: block; /* Hidden by default */
`;

const ctaElementSelection = css`
  cursor: pointer;
  display: block;
  width: 1000px;
  position: fixed;
  top: 0;
  left: 50%;
  margin-left: -500px;
  z-index: 500;
`;

const xbuttonstyle = css`
  align-self: center;
  color: #ffdd49;
  background-color: white;
  border-radius: 80%;
  position: absolute;
  right: -34px;
  top: -34px;
  z-index: 102;
`;

const ScreenshotButton = ({ size = 'default', ...props }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const { screenshot, loading, takeScreenshot } = useScreenshot();
  const label = screenshot ? 'Screenshot Saved' : loading ? 'Taking Screenshot' : 'Take a Screenshot';
  const [isScreenshotButtonClicked, setIsScreenshotButtonClicked] = useState(false);
  const [currDOMState, setCurrDOMState] = useState(null);

  // TODO: change to boolean later
  const [isDOMElementClicked, setIsDOMElementClicked] = useState('dashed');
  const domElementClickedRef = useRef('dashed');

  // store selected dom element and its attributes
  const currDOM = useRef(null);
  const currDOMWidth = useRef(0);
  const currDOMHeight = useRef(0);
  const currDOMLeft = useRef(0);
  const currDOMTop = useRef(0);
  const currDOMRight = useRef(0);
  const currDOMBottom = useRef(0);
  const currDOMPosition = useRef('absolute');
  const screenshotButtonClicked = useRef(false);

  // orientation of X button
  // const cancelButtonOrientation = useRef('right');

  // left, top, right, bottom
  const [currElementBoundingBox, setCurrElementBoundingBox] = useState([0, 0, 0, 0]);
  const [currDOMWidthState, setCurrDOMWidthState] = useState(0);
  const [currDOMHeightState, setCurrDOMHeightState] = useState(0);

  const labelNew = screenshot ? 'New screenshot Saved' : loading ? 'Taking new screenshot' : 'Take a new screenshot';

  useEffect(() => {
    setCurrDOMState(currDOM.current);
    setCurrDOMWidthState(currDOMWidth.current);
    setCurrDOMHeightState(currDOMHeight.current);
    setCurrElementBoundingBox([currDOMLeft.current, currDOMTop.current, currDOMRight.current, currDOMBottom.current]);
    setIsDOMElementClicked(domElementClickedRef.current);
    unlockScrolling();
  }, [currDOMState]);

  // prevent FW from being selected
  const isFWSelected = useCallback((listOfElements) => {
    for (const elem in listOfElements) {
      if (listOfElements[elem].id.includes('feedbackCard')) {
        return true;
      }
    }
    return false;
  }, []);

  // set properties of selected DOM element based on bounding box
  const setSelectedElementProperties = useCallback((currDOMRect) => {
    currDOMWidth.current = currDOMRect.width;
    currDOMHeight.current = currDOMRect.height;
    currDOMLeft.current = currDOMRect.left;
    currDOMRight.current = currDOMRect.right;
    currDOMTop.current = currDOMRect.top;
    currDOMBottom.current = currDOMRect.bottom;

    // console.log('currDOMTop.current: ' +  currDOMTop.current);
    // console.log('currDOMLeft.current: ' +  currDOMLeft.current);
    // console.log('currDOMBottom.current: ' +  currDOMBottom.current);
    // console.log('currDOMRight.current: ' +  currDOMRight.current);

    // adjust for scrolling if element selected is not part of the side or top nav
    if (currDOMPosition.current === 'absolute') {
      currDOMRight.current += window.scrollX;
      currDOMLeft.current += window.scrollX;
      currDOMTop.current += window.scrollY;
      currDOMBottom.current += window.scrollY;
    }
  }, []);

  // event listener for checking whether anything is being hovered
  const handleElementHighlight = ({ pageX, pageY }) => {
    // current position of mouse
    const pos = `(${pageX}, ${pageY})`;
    if (!!pos) {
      if (domElementClickedRef.current === 'solid') {
        document.removeEventListener('mousemove', handleElementHighlight);
      }

      let listOfElements = document.elementsFromPoint(pageX - window.pageXOffset, pageY - window.pageYOffset);
      let domElement = null;

      // get the topmost DOM element excluding overlays and FW modal itself
      if (!isFWSelected(listOfElements)) {
        domElement = listOfElements[0];
        for (const elem in listOfElements) {
          if (!listOfElements[elem]?.className?.includes('overlay')) {
            domElement = listOfElements[elem];
            break;
          }
        }

        // for elements in the top or side nav, set position to fixed. Otherwise set it to absolute
        for (const elem in listOfElements) {
          if (
            listOfElements[elem]?.className?.includes('SidenavContainer') ||
            listOfElements[elem]?.className?.includes('StyledHeaderContainer')
          ) {
            currDOMPosition.current = 'fixed';
            break;
          }
          currDOMPosition.current = 'absolute';
        }
      }

      // hovered element is different from current one
      if (!!domElement && currDOM.current !== domElement) {
        currDOM.current = domElement;
        setCurrDOMState(domElement);

        // set properties like width, height, top, left, etc. for selected element
        setSelectedElementProperties(currDOM.current.getBoundingClientRect());
      }
    }
  };

  // when screenshot button is first clicked
  const takeNewScreenshot = useCallback(() => {
    setIsScreenshotButtonClicked(true);
    screenshotButtonClicked.current = true;
    setIsDOMElementClicked('dashed');
    domElementClickedRef.current = 'dashed';
  }, []);

  const lockScrolling = () => {
    document.body.style.overflow = 'hidden';
  };

  const unlockScrolling = () => {
    document.body.style.overflow = 'visible';
  };

  // close out the instructions panel
  const handleInstructionClick = (e) => {
    e.preventDefault();
    resetProperties();
    unlockScrolling();
  };

  // reset all the properties, overlays and selected elements
  const resetProperties = () => {
    setIsScreenshotButtonClicked(false);
    screenshotButtonClicked.current = false;
    setCurrDOMState(null);
    currDOM.current = null;
    currDOMWidth.current = 0;
    currDOMHeight.current = 0;
    currDOMLeft.current = 0;
    currDOMTop.current = 0;
    currDOMRight.current = 0;
    currDOMBottom.current = 0;
  };

  const handleDOMElementClick = (e) => {
    e.preventDefault();

    domElementClickedRef.current = 'solid';
    setIsDOMElementClicked(domElementClickedRef.current);

    lockScrolling();
  };

  const cancelButtonClick = useCallback((e) => {
    resetProperties();

    setIsScreenshotButtonClicked(true);
    screenshotButtonClicked.current = true;

    setIsDOMElementClicked('dashed');
    domElementClickedRef.current = 'dashed';

    unlockScrolling();
    e.stopPropagation();
  }, []);

  if (isScreenshotButtonClicked) {
    if (isBrowser && !!window && !!document && domElementClickedRef.current === 'dashed') {
      // highlight elements based on mouse movement
      document.addEventListener('mousemove', handleElementHighlight);
    }
  }

  return (
    <>
      <Portal>
        {isScreenshotButtonClicked && (
          <>
            <img
              className="instructionoverlay"
              src={withPrefix('assets/screenshotCTA.svg')}
              alt="Screenshot"
              css={ctaElementSelection}
              onClick={handleInstructionClick}
            />
            <div className="instructionoverlay" css={instructionScreenStyling} />
          </>
        )}
        {isScreenshotButtonClicked && !currDOM.current && (
          <div
            className="overlay"
            css={overlayElementStyle('fixed', 0, 0, document.body.scrollWidth, document.body.scrollHeight)}
          />
        )}
        {isScreenshotButtonClicked && !!currDOM.current && (
          <div id="groupAllElementsForScreenshot">
            <div
              className="overlay"
              onClick={handleDOMElementClick}
              role="button"
              css={hightlightedElementStyle(
                currDOMPosition.current,
                currElementBoundingBox[1],
                currElementBoundingBox[0],
                currDOMWidthState,
                currDOMHeightState,
                isDOMElementClicked
              )}
            >
              {domElementClickedRef.current === 'solid' && (
                <Icon glyph="XWithCircle" css={xbuttonstyle} size={30} onClick={cancelButtonClick} />
              )}
            </div>
            <div
              className="overlay"
              css={overlayElementStyle(
                currDOMPosition.current,
                0,
                0,
                currElementBoundingBox[0] - 15,
                document.body.scrollHeight
              )}
            />
            <div
              className="overlay"
              css={overlayElementStyle(
                currDOMPosition.current,
                0,
                currElementBoundingBox[0] - 15,
                currDOMWidthState + 30,
                currElementBoundingBox[1] - 15
              )}
            />
            <div
              className="overlay"
              css={overlayElementStyle(
                currDOMPosition.current,
                currElementBoundingBox[3] + 15,
                currElementBoundingBox[0] - 15,
                currDOMWidth.current + 30,
                document.body.scrollHeight - currElementBoundingBox[3] - 15
              )}
            />
            <div
              className="overlay"
              css={overlayElementStyle(
                currDOMPosition.current,
                0,
                currElementBoundingBox[0] + currDOMWidth.current + 15,
                document.body.scrollWidth - currElementBoundingBox[2],
                document.body.scrollHeight
              )}
            />
          </div>
        )}
      </Portal>

      <div id="screenshot-button" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <Tooltip
          align="bottom"
          justify="middle"
          triggerEvent="hover"
          open={isHovered}
          trigger={
            <Button variant="default" label={labelNew} onClick={takeNewScreenshot} {...props}>
              {screenshot ? (
                <CheckIcon style={{ color: palette.green.base }} />
              ) : loading ? (
                <SpinnerIcon />
              ) : (
                <CameraIcon />
              )}
            </Button>
          }
        >
          {label}
        </Tooltip>
        <Button onClick={takeScreenshot}>Download</Button>
      </div>
    </>
  );
};

export default ScreenshotButton;
