import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from '@gatsbyjs/reach-router';
import { parse, ParsedQuery } from 'query-string';
import { navigate } from 'gatsby';
import { ComposableNode, ComposableTutorialNode } from '../../types/ast';
import { getLocalValue, setLocalValue } from '../../utils/browser-storage';
import { isBrowser } from '../../utils/is-browser';
import Composable from './Composable';
import ConfigurableOption from './ConfigurableOption';

function filterValidQueryParams(
  parsedQuery: ParsedQuery<string>,
  composableOptions: ComposableTutorialNode['options']['composable-options'],
  fallbackToDefaults: boolean
  // localStorage: Record<string, string>
) {
  const validQueryParams = composableOptions.reduce((res: Record<string, string[]>, composableOption) => {
    res[composableOption['value']] = composableOption.selections.map((s) => s.value);
    return res;
  }, {});

  const res: Record<string, string> = {};

  // query params take precedence
  for (const [key, value] of Object.entries(parsedQuery)) {
    if (key in validQueryParams && typeof value === 'string' && validQueryParams[key].indexOf(value) > -1) {
      res[key] = value;
    }
  }

  // fallback to of composableOptions if flagged
  if (fallbackToDefaults) {
    for (const composableOption of composableOptions) {
      if (!res[composableOption.value]) {
        res[composableOption.value] = composableOption.default;
      }
    }
  }

  return res;
}

function fulfilledSelections(
  filteredParams: Record<string, string>,
  composableOptions: ComposableTutorialNode['options']['composable-options']
) {
  return composableOptions.every((composableOption) => composableOption['value'] in filteredParams);
}

interface ComposableProps {
  nodeData: ComposableTutorialNode;
}

const LOCAL_STORAGE_KEY = 'activeComposables';

const ComposableTutorial = ({ nodeData: { options, children }, ...rest }: ComposableProps) => {
  const composableOptions = options['composable-options'];
  const [currentSelections, setCurrentSelections] = useState<Record<string, string>>(() => ({}));
  const location = useLocation();


  // takes care of query param reading and rerouting
  // if query params fulfill all selections, show the selections
  // otherwise, fallback to getting default values from combination of local storage and node Data
  useEffect(() => {
    if (!isBrowser) {
      return;
    }

    // read query params
    const queryParams = parse(location.search);
    const filteredParams = filterValidQueryParams(queryParams, composableOptions, false);

    // if params fulfill selections, show the current selections
    if (fulfilledSelections(filteredParams, composableOptions)) {
      setLocalValue(LOCAL_STORAGE_KEY, filteredParams);
      setCurrentSelections(filteredParams);
      return;
    }

    // params are missing. get default values using local storage and nodeData
    const localStorage: Record<string, string> = getLocalValue(LOCAL_STORAGE_KEY) ?? {};
    const defaultParams = filterValidQueryParams(localStorage, composableOptions, true);
    const queryString = new URLSearchParams(defaultParams).toString();

    navigate(`?${queryString}`);

    // if params, set the right ones for currentSelections
  }, [composableOptions, location.pathname, location.search]);

  const showComposable = useCallback(
    (dependencies: { [key: string]: string }[]) =>
      dependencies.every((d) => {
        const key = Object.keys(d)[0];
        const value = Object.values(d)[0];
        return currentSelections[key] === value;
      }),
    [currentSelections]
  );

  return (
    <>
      <div>
        {composableOptions.map((option, index) => (
          <ConfigurableOption
            option={option}
            selections={currentSelections}
            setCurrentSelections={setCurrentSelections}
            showComposable={showComposable}
            key={index}
          />
        ))}
      </div>
      {children.map((c, i) => {
        if (showComposable(c.options.selections)) {
          return <Composable nodeData={c as ComposableNode} key={i} />;
        }
        return null;
      })}
    </>
  );
};

export default ComposableTutorial;
