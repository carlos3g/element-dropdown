import React from 'react';
import { measureRenders } from 'reassure';
import { fireEvent, screen } from '@testing-library/react-native';

import { MultiSelect } from '..';

type Item = { label: string; value: string };

const buildData = (n: number): Item[] =>
  Array.from({ length: n }, (_, i) => ({
    label: `Item ${i + 1}`,
    value: String(i + 1),
  }));

const data100 = buildData(100);
const first10 = Array.from({ length: 10 }, (_, i) => String(i + 1));

test('MultiSelect — closed, no chips', async () => {
  await measureRenders(
    <MultiSelect
      testID="multi"
      data={data100}
      labelField="label"
      valueField="value"
      value={[]}
      onChange={() => {}}
    />
  );
});

test('MultiSelect — 10 chips rendered below trigger', async () => {
  await measureRenders(
    <MultiSelect
      testID="multi"
      data={data100}
      labelField="label"
      valueField="value"
      value={first10}
      onChange={() => {}}
    />
  );
});

test('MultiSelect — open with 100 items, 10 already selected', async () => {
  await measureRenders(
    <MultiSelect
      testID="multi"
      data={data100}
      labelField="label"
      valueField="value"
      value={first10}
      onChange={() => {}}
    />,
    {
      scenario: async () => {
        fireEvent.press(screen.getByTestId('multi'));
      },
    }
  );
});

test('MultiSelect — toggle 3 items in quick succession', async () => {
  const onChange = jest.fn();
  await measureRenders(
    <MultiSelect
      testID="multi"
      data={data100}
      labelField="label"
      valueField="value"
      value={[]}
      onChange={onChange}
    />,
    {
      scenario: async () => {
        fireEvent.press(screen.getByTestId('multi'));
        fireEvent.press(screen.getByText('Item 1'));
        fireEvent.press(screen.getByText('Item 2'));
        fireEvent.press(screen.getByText('Item 3'));
      },
    }
  );
});
