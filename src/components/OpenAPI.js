import React from 'react';
import PropTypes from 'prop-types';
import { RedocStandalone, styled } from 'redoc';
import ComponentFactory from './ComponentFactory';

const StyledRedocComponent = styled('div')`
  .token.string {
    color: #000000;
  }

  span.token.boolean {
    color: #00ff00;
  }
`;

const OpenAPI = ({ nodeData: { argument, children, options = {} }, ...rest }) => {
  const usesRST = options?.['uses-rst'];

  if (usesRST) {
    return (
      <>
        {children.map((node, i) => (
          <ComponentFactory {...rest} key={i} nodeData={node} />
        ))}
      </>
    );
  }

  // Check for JSON string spec first
  const spec = children[0]?.value;
  const specOrUrl = spec ? JSON.parse(spec) : argument[0]?.refuri;
  if (!specOrUrl) {
    return null;
  }

  return (
    <StyledRedocComponent>
      <RedocStandalone
        options={{
          maxDisplayedEnumValues: 5,
          hideLoading: true,
          theme: {
            typography: {
              fontSize: '16px',
              fontFamily: 'Akzidenz',
              headings: 'Akzidenz',
              code: {
                fontSize: '14px',
                fontFamily: 'Source Code Pro',
                color: '#800020',
                backgroundColor: '#FFFFFF',
              },
              links: {
                color: '#007CAD',
                visited: '#1A567E',
              },
            },
            sidebar: {
              width: '268px',
              backgroundColor: '#F9FBFA',
              textColor: '#21313C',
              activeTextColor: '#0B3B35',
            },
            rightPanel: {
              backgroundColor: '#061621',
            },
            colors: {
              responses: {
                success: {
                  color: 'black',
                  backgroundColor: 'red',
                  tabTextColor: 'blue',
                },
              },
              warning: {
                main: 'green',
              },
              http: {
                get: 'pink',
              },
            },
            codeBlock: {
              backgroundColor: 'orange',
            },
          },
        }}
        spec={specOrUrl}
        specUrl={specOrUrl}
      />
    </StyledRedocComponent>
  );
};

OpenAPI.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(PropTypes.object).isRequired,
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
    options: PropTypes.shape({
      uses_rst: PropTypes.bool,
    }).isRequired,
  }).isRequired,
};

export default OpenAPI;
