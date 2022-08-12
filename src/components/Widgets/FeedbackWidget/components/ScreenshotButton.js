import React, { useCallback, useState, useEffect, useRef } from 'react';
import { css } from '@emotion/react';
import { withPrefix } from 'gatsby-link';
import Button from '@leafygreen-ui/button';
import Icon from '@leafygreen-ui/icon';
import Portal from '@leafygreen-ui/portal';
import { palette } from '@leafygreen-ui/palette';
import Tooltip from './LeafygreenTooltip';
import { CameraIcon, SpinnerIcon, CheckIcon } from '../icons';
import useScreenshot from '../hooks/useScreenshot';
import { isBrowser } from '../../../../utils/is-browser';

// styling for component selection instructions border
const selectionStateStyling = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
  border: #ffdd49 solid 10px;
  z-index: 11;
  cursor: pointer;
`;

const baseStyle = (position, top, left, width, height) => css`
  position: ${position};
  top: ${top}px;
  left: ${left}px;
  width: ${width ? width + 'px' : `100%`};
  height: ${height}px;
  cursor: pointer;
`;

const overlayElementStyle = (position, top, left, width, height) => css`
  ${baseStyle(position, top, left, width, height)};
  background-color: rgba(0, 0, 0, 0.3);
  display: block;
  z-index: 10;
`;

const hightlightedElementStyle = (position, top, left, width, height, lineStyle) => css`
  ${baseStyle(position, top, left, width, height)};
  outline: #ffdd49 ${lineStyle} 10px;
  outline-offset: 10px;
  float: left;
  display: block;
  z-index: 13;
`;

const xButtonStyle = (position, top, right) => css`
  position: ${position};
  top: ${Math.max(top - 5, 15)}px;
  left: ${Math.min(right - 25, window.innerWidth - 45)}px;
  display: block;
  color: #ffdd49;
  background-color: white;
  border-radius: 80%;
  cursor: pointer;
  z-index: 14;
`;

const ctaElementSelection = css`
  position: fixed;
  display: block;
  width: 1000px;
  top: 0;
  left: 50%;
  margin-left: -500px;
  cursor: pointer;
  z-index: 15;
`;

const ScreenshotButton = ({ size = 'default', ...props }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { screenshot, loading } = useScreenshot();
  const label = screenshot ? 'Screenshot Saved' : loading ? 'Taking Screenshot' : 'Take a Screenshot';
  const [isScreenshotButtonClicked, setIsScreenshotButtonClicked] = useState(false);
  const [currDOMState, setCurrDOMState] = useState(null);

  // border around highlighted element
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

  // state representing the left, top, right, bottom coordinates of the current selected element
  const [currElementBoundingBox, setCurrElementBoundingBox] = useState([0, 0, 0, 0]);
  const [currDOMWidthState, setCurrDOMWidthState] = useState(0);
  const [currDOMHeightState, setCurrDOMHeightState] = useState(0);

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

    // adjust for scrolling if element selected is not part of the side or top nav
    if (currDOMPosition.current === 'absolute') {
      currDOMRight.current += window.scrollX;
      currDOMLeft.current += window.scrollX;
      currDOMTop.current += window.scrollY;
      currDOMBottom.current += window.scrollY;
    }
  }, []);

  // event listener to check whether elements are being hovered over
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

      // hovered element is different from current element
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
      {isScreenshotButtonClicked && (
        <Portal>
          <>
            <img
              className="instructionoverlay"
              src={withPrefix('assets/screenshotCTA.svg')}
              alt="Screenshot"
              css={ctaElementSelection}
              onClick={handleInstructionClick}
            />
            <div className="instructionoverlay" css={selectionStateStyling} />
          </>
          {!currDOM.current && (
            <div
              className="overlay"
              css={overlayElementStyle('fixed', 0, 0, document.body.scrollWidth, document.body.scrollHeight)}
            />
          )}
          {!!currDOM.current && (
            <div id="elementSelectorOverlays">
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
              />
              {domElementClickedRef.current === 'solid' && (
                <Icon
                  glyph="XWithCircle"
                  css={xButtonStyle(currDOMPosition.current, currElementBoundingBox[1], currElementBoundingBox[2])}
                  size={30}
                  onClick={cancelButtonClick}
                />
              )}
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
      )}

      <div id="screenshot-button" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <Tooltip
          align="bottom"
          justify="middle"
          triggerEvent="hover"
          open={isHovered}
          trigger={
            <Button variant="default" label={label} onClick={takeNewScreenshot} {...props}>
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
      </div>
    </>
  );
};

export default ScreenshotButton;
