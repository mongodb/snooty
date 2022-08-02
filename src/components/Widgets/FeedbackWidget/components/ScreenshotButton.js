<<<<<<< HEAD
import React, { useCallback, useState, useEffect, useRef } from 'react';
import { css } from '@emotion/react';
import { withPrefix } from 'gatsby-link';
import Button from '@leafygreen-ui/button';
import Icon from '@leafygreen-ui/icon';
import Portal from '@leafygreen-ui/portal';
import Tooltip from './LeafygreenTooltip';
import { CameraIcon } from '../icons';
import { useFeedbackState } from '../context';
import { feedbackId } from '../FeedbackForm';
import { isBrowser } from '../../../../utils/is-browser';
import useNoScroll from '../hooks/useNoScroll';

const HIGHLIGHT_BORDER_SIZE = 5;

const instructionsBorderStyling = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: #ffdd49 solid ${HIGHLIGHT_BORDER_SIZE}px;
  z-index: 11;
`;

const instructionsPanelStyling = css`
  position: fixed;
  width: 800px;
  top: 0;
  left: 50%;
  margin-left: -400px;
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
const highlightedElementStyle = (position, top, left, width, height, lineStyle) => css`
  ${baseStyle(position, top, left, width, height)};
  outline: #ffdd49 ${lineStyle} ${HIGHLIGHT_BORDER_SIZE}px;
  outline-offset: 3px;
  float: left;
  z-index: 11;
  cursor: ${lineStyle === 'solid' ? 'unset' : 'pointer'};
`;

const exitButtonStyle = (position, top, left) => css`
  position: ${position};
  top: ${Math.max(top - 1, 8)}px;
  left: ${Math.max(left - 1, 8)}px;
  color: #ffdd49;
  background-color: white;
  border-radius: 80%;
  cursor: pointer;
  z-index: 12;
`;

const ScreenshotButton = ({ size = 'default', ...props }) => {
  const { setScreenshotTaken } = useFeedbackState();
  const label = 'Take a Screenshot';
  const [isScreenshotButtonClicked, setIsScreenshotButtonClicked] = useState(false);
  const [currElemState, setCurrElemState] = useState(null);

  // border around highlighted element
  const domElementClickedRef = useRef('dashed');
  const [selectedElementBorderStyle, setSelectedElementBorderStyle] = useState('dashed');

  // store selected dom element and its attributes
  const currElem = useRef(null);
  const initialElemProperties = { width: 0, height: 0, top: 0, bottom: 0, left: 0, right: 0, position: 'absolute' };
  const currElemProperties = useRef(initialElemProperties);
  const [elemProps, setElemProps] = useState({});

  const documentScrollWidth = document.body.scrollWidth;
  const documentScrollHeight = document.body.scrollHeight;

  useEffect(() => {
    setElemProps({
      width: currElemProperties.current['width'],
      height: currElemProperties.current['height'],
      top: currElemProperties.current['top'],
      bottom: currElemProperties.current['bottom'],
      left: currElemProperties.current['left'],
      right: currElemProperties.current['right'],
      position: currElemProperties.current['position'],
    });
    setSelectedElementBorderStyle(domElementClickedRef.current);
  }, [currElemState]);

  // prevent FW from being selected
  const isFWSelected = useCallback((listOfElements) => {
    for (const elem in listOfElements) {
      if (listOfElements[elem]?.id?.includes(feedbackId)) {
        return true;
      }
    }
    return false;
  }, []);

  // set properties of selected DOM element based on bounding box
  const setSelectedElementProperties = useCallback((currDOMRect) => {
    const isScrolled = currElemProperties.current['position'] === 'absolute';

    currElemProperties.current['width'] = currDOMRect.width;
    currElemProperties.current['height'] = currDOMRect.height;

    // adjust for scrolling if element selected is not part of the side or top nav
    currElemProperties.current['top'] = isScrolled ? currDOMRect.top + window.scrollY : currDOMRect.top;
    currElemProperties.current['bottom'] = isScrolled ? currDOMRect.bottom + window.scrollY : currDOMRect.bottom;
    currElemProperties.current['left'] = isScrolled ? currDOMRect.left + window.scrollX : currDOMRect.left;
    currElemProperties.current['right'] = isScrolled ? currDOMRect.right + window.scrollX : currDOMRect.right;
  }, []);

  // event listener to check whether elements are being hovered over
  const handleElementHighlight = ({ pageX, pageY }) => {
    if (domElementClickedRef.current === 'solid') {
      document.removeEventListener('mousemove', handleElementHighlight);
    }

    // current position of mouse with scrolling taken into account
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
        currElemProperties.current['position'] = 'fixed';
        break;
      }
      currElemProperties.current['position'] = 'absolute';
    }

    // hovered element is different from current element
    if (!!domElement && currElem.current !== domElement) {
      currElem.current = domElement;
      setCurrElemState(domElement);

      // set properties like width, height, top, left, etc. for selected element
      setSelectedElementProperties(currElem.current.getBoundingClientRect());
    }
  };

  // when screenshot button is first clicked
  const takeNewScreenshot = useCallback(() => {
    setIsScreenshotButtonClicked(true);
    domElementClickedRef.current = 'dashed';
    setSelectedElementBorderStyle('dashed');
  }, []);

  // close out the instructions panel
  const handleInstructionClick = () => {
    document.getElementById(feedbackId).style.display = 'block';
    resetProperties();
  };

  // reset all the properties, overlays and selected elements
  const resetProperties = () => {
    currElem.current = null;
    currElemProperties.current = initialElemProperties;
    setIsScreenshotButtonClicked(false);
    setCurrElemState(null);
    setScreenshotTaken(false);
  };

  const handleDOMElementClick = (e) => {
    e.preventDefault();

    domElementClickedRef.current = 'solid';
    setSelectedElementBorderStyle(domElementClickedRef.current);
    setScreenshotTaken(true);

    document.getElementById(feedbackId).style.display = 'block';
  };

  const handleExitButtonClick = (e) => {
    resetProperties();

    setIsScreenshotButtonClicked(true);
    domElementClickedRef.current = 'dashed';
    setSelectedElementBorderStyle('dashed');

    e.stopPropagation();
  };

  if (isScreenshotButtonClicked) {
    if (isBrowser && domElementClickedRef.current === 'dashed') {
      document.getElementById(feedbackId).style.display = 'none';
      // highlight elements based on mouse movement
      document.addEventListener('mousemove', handleElementHighlight);
    }
  }

  // lock the page when element is selected
  useNoScroll(!!currElem.current && domElementClickedRef.current === 'solid');

  return (
    <>
      {isScreenshotButtonClicked && (
        <Portal>
          <>
            <img
              className={fwInstructionsId}
              src={withPrefix('assets/screenshotCTA.svg')}
              alt="Screenshot"
              css={instructionsPanelStyling}
              onClick={handleInstructionClick}
            />
            <div className={fwInstructionsId} css={instructionsBorderStyling} />
          </>
          {!currElem.current && (
            <div
              className="overlay"
              css={overlayElementStyle('fixed', 0, 0, documentScrollWidth, documentScrollHeight)}
            />
          )}
          {!!currElem.current && (
            <>
              <div
                className="overlay"
                onClick={handleDOMElementClick}
                role="button"
                css={highlightedElementStyle(
                  elemProps['position'],
                  elemProps['top'],
                  elemProps['left'],
                  elemProps['width'],
                  elemProps['height'],
                  selectedElementBorderStyle
                )}
              />
              {domElementClickedRef.current === 'solid' && (
                <div className={fwExitButtonId}>
                  <Icon
                    glyph="XWithCircle"
                    css={exitButtonStyle(elemProps['position'], elemProps['top'], elemProps['left'])}
                    size={24}
                    onClick={handleExitButtonClick}
                  />
                </div>
              )}
              <div
                className="overlay-left"
                css={overlayElementStyle(
                  elemProps['position'],
                  0,
                  0,
                  elemProps['left'] - HIGHLIGHT_BORDER_SIZE,
                  documentScrollHeight
                )}
              />
              <div
                className="overlay-top"
                css={overlayElementStyle(
                  elemProps['position'],
                  0,
                  elemProps['left'] - HIGHLIGHT_BORDER_SIZE,
                  elemProps['width'] + HIGHLIGHT_BORDER_SIZE * 2,
                  elemProps['top'] - HIGHLIGHT_BORDER_SIZE
                )}
              />
              <div
                className="overlay-bottom"
                css={overlayElementStyle(
                  elemProps['position'],
                  elemProps['bottom'] + HIGHLIGHT_BORDER_SIZE,
                  elemProps['left'] - HIGHLIGHT_BORDER_SIZE,
                  elemProps['width'] + HIGHLIGHT_BORDER_SIZE * 2,
                  documentScrollHeight - elemProps['bottom'] - HIGHLIGHT_BORDER_SIZE
                )}
              />
              <div
                className="overlay-right"
                css={overlayElementStyle(
                  elemProps['position'],
                  0,
                  elemProps['left'] + elemProps['width'] + HIGHLIGHT_BORDER_SIZE,
                  documentScrollWidth - elemProps['right'],
                  documentScrollHeight
                )}
              />
            </>
          )}
        </Portal>
      )}

      <Tooltip
        align="bottom"
        justify="middle"
        triggerEvent="hover"
        trigger={
          <Button variant="default" onClick={takeNewScreenshot} {...props}>
            <CameraIcon />
          </Button>
        }
        popoverZIndex={15}
      >
        {label}
      </Tooltip>
    </>
=======
import React from 'react';
//import Button from '@leafygreen-ui/button';
//import Tooltip from './LeafygreenTooltip';
//import { SpinnerIcon, CheckIcon } from '../icons';
//import { uiColors } from '@leafygreen-ui/palette';
import styled from '@emotion/styled';
import useScreenshot from '../hooks/useScreenshot';

const ScreenshotIcon = () => (
  <svg width="19" z-index="10" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="16.1788" height="16.9225" stroke="#5D6C74" stroke-width="2" stroke-dasharray="2 2" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5.54156 11.7681L0.123047 0.424377L12.001 4.58509L8.42039 6.45628L13.2546 10.7953L11.842 12.5142L6.81489 7.99939L5.54156 11.7681Z"
      fill="#5D6C74"
    />
  </svg>
);

const ScreenshotSelect = styled('span')`
  z-index: 5;
  margin-top: 155px;
  position: fixed;
  margin-right: 153px;
  background: #ffffff;
  height: 22px;
`;

const StyledArrow = styled('div')`
  margin-left: 12px !important;
  margin-top: -20px;
`;

export default function ScreenshotButton({ size = 'default' }) {
  const [setIsHovered] = React.useState(false);
  const { takeScreenshot } = useScreenshot();
  //const label = screenshot ? 'Screenshot Saved' : loading ? 'Taking Screenshot' : 'Take a Screenshot';
  return (
    <ScreenshotSelect
      id="screenshot-button"
      onClick={takeScreenshot}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ScreenshotIcon />
      <StyledArrow>
        <ArrowIcon />
      </StyledArrow>
    </ScreenshotSelect>
>>>>>>> aa590d9 (Screenshot Icon Fixed)
  );
};

export default ScreenshotButton;
export const fwInstructionsId = 'overlay-instructions';
export const fwExitButtonId = 'exit-button';
