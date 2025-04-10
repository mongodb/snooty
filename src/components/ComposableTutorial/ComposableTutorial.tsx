import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from '@gatsbyjs/reach-router';
import { parse, ParsedQuery } from 'query-string';
import { navigate } from 'gatsby';
import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
import { ComposableNode, ComposableTutorialNode } from '../../types/ast';
import { getLocalValue, setLocalValue } from '../../utils/browser-storage';
import { isBrowser } from '../../utils/is-browser';
import { theme } from '../../theme/docsTheme';
import Composable from './Composable';
import ConfigurableOption from './ConfigurableOption';

function filterValidQueryParams(
  parsedQuery: ParsedQuery<string>,
  composableOptions: ComposableTutorialNode['composable-options'],
  validSelections: Set<string>,
  fallbackToDefaults = false
) {
  const validQueryParams = composableOptions.reduce(
    (res: Record<string, { values: string[]; dependencies: Record<string, string>[] }>, composableOption) => {
      res[composableOption['value']] = {
        values: composableOption.selections.map((s) => s.value),
        dependencies: composableOption.dependencies,
      };
      return res;
    },
    {}
  );

  const res: Record<string, string> = {};

  // query params take precedence
  for (const [key, value] of Object.entries(parsedQuery)) {
    const dependenciesMet = validQueryParams[key].dependencies.every((d) => {
      const key = Object.keys(d)[0];
      return parsedQuery[key] === Object.values(d)[0];
    });
    if (
      key in validQueryParams &&
      typeof value === 'string' &&
      validQueryParams[key]['values'].indexOf(value) > -1 &&
      dependenciesMet
    ) {
      res[key] = value;
    }
  }

  if (!fallbackToDefaults) {
    return res;
  }

  // fallback to composableOptions if not present in query
  for (const composableOption of composableOptions) {
    const dependenciesMet = composableOption.dependencies.every((d) => {
      const key = Object.keys(d)[0];
      return res[key] === Object.values(d)[0];
    });

    // skip this composable option if
    // there is already a valid value in parsed query,
    // or this option has missing dependency
    if (res[composableOption.value] || !dependenciesMet) {
      continue;
    }
    // check if default value for this option has content
    const targetObj = { ...res, [composableOption.value]: composableOption.default };
    const targetString = Object.keys(targetObj)
      .map((key) => `${key}=${targetObj[key]}`)
      .sort()
      .join('.');
    if (validSelections.has(targetString)) {
      res[composableOption.value] = composableOption.default;
      continue;
    }

    // if the specified default does not have content (fault in data)
    // safety to find a valid combination from children and select
    const currentSelections = Object.keys({ ...res })
      .map((key) => `${key}=${targetObj[key]}`)
      .sort()
      .join('.');
    for (const [validSelection] of validSelections.entries()) {
      const validSelectionParts = validSelection.split('.');
      const selectionPartForOption = validSelectionParts.find((str) => str.includes(`${composableOption.value}=`));
      if (validSelection.includes(currentSelections) && selectionPartForOption) {
        res[composableOption.value] = selectionPartForOption.split('=')[1];
      }
    }
  }

  return res;
}

function fulfilledSelections(
  filteredParams: Record<string, string>,
  composableOptions: ComposableTutorialNode['composable-options']
) {
  // every composable option should either
  // have its value as a key in selections
  // or its dependency was not met
  return composableOptions.every((composableOption) => {
    const dependenciesMet = composableOption.dependencies.every((d) => {
      const key = Object.keys(d)[0];
      return filteredParams[key] === Object.values(d)[0];
    });
    return composableOption['value'] in filteredParams || !dependenciesMet;
  });
}

export function getSelectionPermutation(selections: Record<string, string>[]): Set<string> {
  const res: Set<string> = new Set();
  let partialRes: string[] = [];
  for (const selection of selections) {
    for (const [key, value] of Object.entries(selection)) {
      partialRes.push(`${key}=${value}`);
      res.add(partialRes.sort().join('.'));
    }
  }
  return res;
}

interface ComposableProps {
  nodeData: ComposableTutorialNode;
}

const LOCAL_STORAGE_KEY = 'activeComposables';

const ComposableContainer = styled.div`
  display: flex;
  position: sticky;
  top: ${theme.header.actionBarMobileHeight};
  background: var(--background-color-primary);
  column-gap: ${theme.size.default};
  row-gap: 12px;
  justify-items: space-between;
  border-bottom: 1px solid ${palette.gray.light2};
  padding-bottom: ${theme.size.medium};
`;

const ComposableTutorial = ({
  nodeData: { 'composable-options': composableOptions, children },
  ...rest
}: ComposableProps) => {
  const [currentSelections, setCurrentSelections] = useState<Record<string, string>>(() => ({}));
  const location = useLocation();

  const validSelections = useMemo(() => {
    let res: Set<string> = new Set();
    for (const composableNode of children) {
      const newSet = getSelectionPermutation(composableNode.options.selections);
      for (const elm of newSet) {
        res.add(elm);
      }
    }
    return res;
  }, [children]);

  // takes care of query param reading and rerouting
  // if query params fulfill all selections, show the selections
  // otherwise, fallback to getting default values from combination of local storage and node Data
  useEffect(() => {
    if (!isBrowser) {
      return;
    }

    // read query params
    const queryParams = parse(location.search);
    const filteredParams = filterValidQueryParams(queryParams, composableOptions, validSelections, false);

    // if params fulfill selections, show the current selections
    if (fulfilledSelections(filteredParams, composableOptions)) {
      setLocalValue(LOCAL_STORAGE_KEY, filteredParams);
      setCurrentSelections(filteredParams);
      return;
    }

    // params are missing. get default values using local storage and nodeData
    const localStorage: Record<string, string> = getLocalValue(LOCAL_STORAGE_KEY) ?? {};
    const defaultParams = filterValidQueryParams(localStorage, composableOptions, validSelections, true);
    const queryString = new URLSearchParams(defaultParams).toString();
    navigate(`?${queryString}`);
  }, [composableOptions, location.pathname, location.search, validSelections]);

  const showComposable = useCallback(
    (dependencies: { [key: string]: string }[]) =>
      dependencies.every((d) => {
        const key = Object.keys(d)[0];
        const value = Object.values(d)[0];
        return currentSelections[key] === value;
      }),
    [currentSelections]
  );

  const onSelect = useCallback(
    (value: string, option: string, index: number) => {
      // the ones that occur less than index, take it
      const newSelections = { ...currentSelections, [option]: value };

      const targetString = Object.keys(newSelections)
        .map((key) => `${key}=${newSelections[key]}`)
        .sort()
        .join('.');

      if (validSelections.has(targetString)) {
        setCurrentSelections(currentSelections);
        const queryString = new URLSearchParams(newSelections).toString();
        return navigate(`?${queryString}`);
      }

      // need to correct preceding options
      // keep selections for previous composable options
      // and generate valid selections
      const persistSelections: Record<string, string> = {
        [option]: value,
      };
      for (let idx = 0; idx < index; idx++) {
        const composableOption = composableOptions[idx];
        if (composableOption.value !== option && currentSelections[composableOption.value]) {
          persistSelections[composableOption.value] = currentSelections[composableOption.value];
        }
      }

      const defaultParams = filterValidQueryParams(persistSelections, composableOptions, validSelections, true);
      const queryString = new URLSearchParams(defaultParams).toString();
      return navigate(`?${queryString}`);
    },
    [composableOptions, currentSelections, validSelections]
  );

  return (
    <>
      <ComposableContainer>
        {composableOptions.map((option, index) => (
          <ConfigurableOption
            validSelections={validSelections}
            option={option}
            selections={currentSelections}
            onSelect={onSelect}
            showComposable={showComposable}
            key={index}
            optionIndex={index}
            precedingOptions={composableOptions.slice(0, index)}
          />
        ))}
      </ComposableContainer>
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
