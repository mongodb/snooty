import React from 'react';
import { Combobox, ComboboxOption } from '@leafygreen-ui/combobox';

export default function DiffSelect({ resourceVersions }) {
  const versionOptions = resourceVersions.map((version) => (
    <ComboboxOption key={version} value={version}></ComboboxOption>
  ));
  return (
    <>
      <Combobox label="Resource Version 1">{versionOptions}</Combobox>
      <Combobox label="Resource Version 2">{versionOptions}</Combobox>
    </>
  );
}
