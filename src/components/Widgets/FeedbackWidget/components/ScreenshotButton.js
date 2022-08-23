import React, { useCallback, useState, useEffect, useRef } from 'react';
import { css } from '@emotion/react';
import { withPrefix } from 'gatsby-link';
import Button from '@leafygreen-ui/button';
import Icon from '@leafygreen-ui/icon';
import Portal from '@leafygreen-ui/portal';
import Tooltip from './LeafygreenTooltip';
import { CameraIcon } from '../icons';
import { useFeedbackState } from '../context';
import { isBrowser } from '../../../../utils/is-browser';

const instructionsBorderStyling = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: #ffdd49 solid 10px;
  z-index: 11;
`;

const instructionsPanelStyling = css`
  position: fixed;
  width: 1000px;
  top: 0;
  left: 50%;
  margin-left: -500px;
  cursor: pointer;
  z-index: 13;
`;

const baseStyle = (position, top, left, width, height) => css`
  position: ${position};
  top: ${top}px;
  left: ${left}px;
  width: ${width ? width + 'px' : `100%`};
  height: ${height}px;
  cursor: pointer;
`;

// styling for shadow overlays around the current selected component
const overlayElementStyle = (position, top, left, width, height) => css`
  ${baseStyle(position, top, left, width, height)};
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 10;
`;

// current hovered or selected component
const hightlightedElementStyle = (position, top, left, width, height, lineStyle) => css`
  ${baseStyle(position, top, left, width, height)};
  outline: #ffdd49 ${lineStyle} 10px;
  outline-offset: 10px;
  float: left;
  z-index: 11;
`;

const xButtonStyle = (position, top, right) => css`
  position: ${position};
  top: ${Math.max(top - 5, 15)}px;
  left: ${Math.min(right - 25, window.innerWidth - 45)}px;
  color: #ffdd49;
  background-color: white;
  border-radius: 80%;
  cursor: pointer;
  z-index: 12;
`;

const ScreenshotButton = ({ size = 'default', ...props }) => {
  const { setScreenshotTaken } = useFeedbackState();
  const [isHovered, setIsHovered] = useState(false);
  const label = 'Take a Screenshot';
  // TODO: incorporate tooltip for new screenshot icon from DOP-2400
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

      // get the topmost DOM element excluding overlays
      if (!isFWSelected(listOfElements)) {
        domElement = listOfElements[0];
        for (const elem in listOfElements) {
          if (!listOfElements[elem]?.className?.includes('overlay')) {
            domElement = listOfElements[elem];
            break;
          }
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
  const handleInstructionClick = () => {
    document.getElementById('feedbackCard').style.display = 'block';
    resetProperties();
    unlockScrolling();
  };

  // reset all the properties, overlays and selected elements
  const resetProperties = () => {
    setIsScreenshotButtonClicked(false);
    screenshotButtonClicked.current = false;
    setScreenshotTaken(false);
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

    document.getElementById('feedbackCard').style.display = 'block';
    domElementClickedRef.current = 'solid';
    setIsDOMElementClicked(domElementClickedRef.current);
    setScreenshotTaken(true);

    lockScrolling();
  };

  const cancelButtonClick = (e) => {
    resetProperties();

    setIsScreenshotButtonClicked(true);
    screenshotButtonClicked.current = true;

    setIsDOMElementClicked('dashed');
    domElementClickedRef.current = 'dashed';

    unlockScrolling();
    e.stopPropagation();
  };

  if (isScreenshotButtonClicked) {
    if (isBrowser && domElementClickedRef.current === 'dashed') {
      document.getElementById('feedbackCard').style.display = 'none';
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
              className="overlayInstructions"
              src={withPrefix('assets/screenshotCTA.svg')}
              alt="Screenshot"
              css={instructionsPanelStyling}
              onClick={handleInstructionClick}
            />
            <div className="overlayInstructions" css={instructionsBorderStyling} />
          </>
          {!currDOM.current && (
            <div
              className="overlay"
              css={overlayElementStyle('fixed', 0, 0, document.body.scrollWidth, document.body.scrollHeight)}
            />
          )}
          {!!currDOM.current && (
            <>
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
                <div className="xButton">
                  <Icon
                    glyph="XWithCircle"
                    css={xButtonStyle(currDOMPosition.current, currElementBoundingBox[1], currElementBoundingBox[2])}
                    size={30}
                    onClick={cancelButtonClick}
                  />
                </div>
              )}
              <div
                className="overlayLeft"
                css={overlayElementStyle(
                  currDOMPosition.current,
                  0,
                  0,
                  currElementBoundingBox[0] - 15,
                  document.body.scrollHeight
                )}
              />
              <div
                className="overlayTop"
                css={overlayElementStyle(
                  currDOMPosition.current,
                  0,
                  currElementBoundingBox[0] - 15,
                  currDOMWidthState + 30,
                  currElementBoundingBox[1] - 15
                )}
              />
              <div
                className="overlayBottom"
                css={overlayElementStyle(
                  currDOMPosition.current,
                  currElementBoundingBox[3] + 15,
                  currElementBoundingBox[0] - 15,
                  currDOMWidth.current + 30,
                  document.body.scrollHeight - currElementBoundingBox[3] - 15
                )}
              />
              <div
                className="overlayRight"
                css={overlayElementStyle(
                  currDOMPosition.current,
                  0,
                  currElementBoundingBox[0] + currDOMWidth.current + 15,
                  document.body.scrollWidth - currElementBoundingBox[2],
                  document.body.scrollHeight
                )}
              />
            </>
          )}
        </Portal>
      )}

      <div
        className="screenshot-button"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Tooltip
          align="bottom"
          justify="middle"
          triggerEvent="hover"
          open={isHovered}
          trigger={
            <Button variant="default" label={label} onClick={takeNewScreenshot} {...props}>
              <CameraIcon />
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
