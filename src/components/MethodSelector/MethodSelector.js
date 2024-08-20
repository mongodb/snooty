import React, { useState } from 'react';
import { RadioBox, RadioBoxGroup } from '@leafygreen-ui/radio-box-group';
import { css, cx } from '@leafygreen-ui/emotion';
import ComponentFactory from '../ComponentFactory';
import { theme } from '../../theme/docsTheme';
import MethodOptionContent from './MethodOptionContent';

const HORIZONTAL_GAP = '16px';

// NOTE-4686: Use grid if we want to have column widths responsive while keeping all widths the same
// Use flex with calculated widths, 0 flex-grow, and flex-wrap if we want a consistent width that wraps
const radioBoxGroupStyle = (count) => css`
  display: grid;
  grid-template-columns: repeat(${count > 3 ? 2 : 1}, minmax(0, 1fr));
  gap: ${HORIZONTAL_GAP};
  // Force component to hit content's max width on pages that have minimal content
  max-width: 100vw;

  @media ${theme.screenSize.mediumAndUp} {
    grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  }

  // Must try to auto-fit at this breakpoint because of difficulties
  // getting radio boxes to be the same width when side nav takes up half the screen
  @media ${theme.screenSize.largeAndUp} {
    grid-template-columns: repeat(auto-fit, minmax(104px, 1fr));
  }
`;

const radioBoxStyle = css`
  height: 48px;
  margin: 0;

  div {
    // Reduce padding to allow boxes to fit better on tablet screen sizes
    padding: 14px 12px;
  }

  :not(:last-of-type) {
    margin: 0;
  }
`;

const MethodSelector = ({ nodeData: { children } }) => {
  const [selectedMethod, setSelectedMethod] = useState(null);

  // children.splice(0, 3);
  const content = children.slice(2);

  return (
    <>
      {/* <div>
        <p>
          Lorem ipsum odor amet, consectetuer adipiscing elit. Ultrices auctor egestas adipiscing convallis tellus integer maecenas. Himenaeos ut auctor faucibus lobortis mauris blandit. Pulvinar inceptos volutpat lobortis montes nulla, sociosqu magna condimentum. Sociosqu et auctor sagittis commodo neque posuere semper. Vivamus ornare vulputate ullamcorper, interdum mollis lacus. Maximus iaculis finibus facilisis nec viverra. Dapibus magna porttitor euismod eleifend velit nibh. Efficitur dolor malesuada sem laoreet purus ultrices placerat.
        </p>
        <p>
          Pharetra ullamcorper vivamus maecenas malesuada tristique. Ante pellentesque duis tempor lacus est vehicula. Dictumst at dui scelerisque ridiculus facilisis gravida mattis. Phasellus eleifend tellus libero diam; vivamus tincidunt. Lectus mauris primis leo ante duis euismod iaculis. Dignissim ultricies nisi potenti adipiscing dignissim egestas vestibulum. Massa ultricies purus nunc vel quam varius rutrum a.
        </p>
        <p>
          Egestas ipsum quisque hendrerit euismod faucibus ante urna. Ac nulla pulvinar vel lobortis sagittis morbi. Vestibulum ullamcorper augue, sollicitudin conubia non purus eros. Ac eu finibus egestas torquent; a iaculis commodo. Convallis integer nisi eros class enim ornare. Ornare vitae etiam cubilia ultricies tincidunt sociosqu ad cras taciti. Nibh sodales penatibus hac convallis convallis; ipsum velit rhoncus. Adipiscing convallis mattis ex nisl adipiscing ut pharetra. Ultrices dis vel neque tellus fermentum.
        </p>
        <p>
          Platea vitae adipiscing nulla egestas eleifend laoreet. Et aenean tortor quis maecenas faucibus arcu venenatis tellus sem. Elit mattis etiam auctor vulputate aliquam habitasse. Enim potenti habitant aenean placerat enim. Tempor dolor blandit potenti potenti venenatis nullam proin penatibus. Rutrum per sodales purus placerat mattis sollicitudin hendrerit. Mi facilisis elementum cursus fames ante. Dictum himenaeos curabitur nisi ac sed turpis rutrum nostra.
        </p>
        <p>
          Vitae quam aliquet dui nullam ultrices efficitur. Orci arcu tortor at blandit primis. Adipiscing tellus velit vehicula sodales pharetra semper; himenaeos luctus diam. Aliquet tempor velit turpis nibh lacus. Nam tellus ipsum mus iaculis id tincidunt est. Blandit fusce cras venenatis tincidunt tincidunt tempor pulvinar leo pharetra.
        </p>
      </div> */}
      <RadioBoxGroup 
        className={cx(radioBoxGroupStyle(content.length))}
        size={'full'}
        onChange={({ target: { defaultValue } }) => {
          setSelectedMethod(defaultValue);
          // TODO-4686: Report analytics on selection
        }}
      >
        {content.map(({ options: { title, id } }) => {
          return (
            <RadioBox key={id} className={cx(radioBoxStyle)} value={id}>{title}</RadioBox>
          );
        })}
      </RadioBoxGroup>
      {children.map((child, index) => {
        if (child.name !== 'method-option') return null;
        return (
          <MethodOptionContent key={index} nodeData={child} selectedMethod={selectedMethod} />
        );
      })}
    </>
  );
};

export default MethodSelector;
