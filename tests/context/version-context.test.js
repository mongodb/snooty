import React, { useContext } from 'react';
import * as Gatsby from 'gatsby';
import { render } from '@testing-library/react';

import { VersionContextProvider, VersionContext } from '../../src/context/version-context';

const useStaticQuery = jest.spyOn(Gatsby, 'useStaticQuery');
const setProjectAndAssociatedProducts = (project) => {
  useStaticQuery.mockImplementation(() => ({
    site: {
      siteMetadata: {
        project,
      },
    },
  }));
};

const TestConsumer = () => {
  const { activeVersions, setActiveVersions, availableVersions } = useContext(VersionContext);

  const handleClick = (project, version) => {
    console.log(project);
    console.log(version);
    setActiveVersions(project, version);
  };
  return (
    <>
      <h1>active versions:</h1>
      <div id="active-versions">
        {activeVersions.map((versionName, projectName) => `${projectName} : ${versionName}`)}
      </div>
      <h1>availableVersions:</h1>
      <div id="available-versions">
        {availableVersions.map((versionName, projectName) => (
          <div
            onClick={() => {
              handleClick(projectName, versionName);
            }}
            key={projectName + versionName}
            id={projectName + versionName}
          >
            {projectName} : {versionName}:
          </div>
        ))}
      </div>
    </>
  );
};

const mountConsumer = () => {
  setProjectAndAssociatedProducts();
  return render(
    <VersionContextProvider>
      <TestConsumer />
    </VersionContextProvider>
  );
};

describe('Version Context', () => {
  let wrapper;
  beforeEach(() => {
    // CHECK LOCAL STORAGE
    wrapper = mountConsumer();
  });

  it('it has initial value if local storage is empty', () => {
    wrapper.debug();
  });

  it('initializes with values from local storage', () => {});

  it('updates context values and local storage if called from consumers', () => {});

  it('does not change availableVersions after init', () => {});
});
