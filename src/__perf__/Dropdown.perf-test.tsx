import React from 'react';
import { measureRenders } from 'reassure';
import { fireEvent, screen } from '@testing-library/react-native';

import { Dropdown } from '..';

type Item = { label: string; value: string };

const buildData = (n: number): Item[] =>
  Array.from({ length: n }, (_, i) => ({
    label: `Item ${i + 1}`,
    value: String(i + 1),
  }));

const data100 = buildData(100);
const data1000 = buildData(1000);

test('Dropdown — closed (no list mounted)', async () => {
  await measureRenders(
    <Dropdown
      testID="dropdown"
      data={data100}
      labelField="label"
      valueField="value"
      onChange={() => {}}
    />
  );
});

test('Dropdown — open with 100 items', async () => {
  await measureRenders(
    <Dropdown
      testID="dropdown"
      data={data100}
      labelField="label"
      valueField="value"
      onChange={() => {}}
    />,
    {
      scenario: async () => {
        fireEvent.press(screen.getByTestId('dropdown'));
      },
    }
  );
});

test('Dropdown — open with 1000 items', async () => {
  await measureRenders(
    <Dropdown
      testID="dropdown"
      data={data1000}
      labelField="label"
      valueField="value"
      onChange={() => {}}
    />,
    {
      scenario: async () => {
        fireEvent.press(screen.getByTestId('dropdown'));
      },
    }
  );
});

test('Dropdown — search churn (3 keystrokes over 100 items)', async () => {
  await measureRenders(
    <Dropdown
      testID="dropdown"
      data={data100}
      labelField="label"
      valueField="value"
      search
      onChange={() => {}}
    />,
    {
      scenario: async () => {
        fireEvent.press(screen.getByTestId('dropdown'));
        const input = screen.getByTestId('dropdown input');
        fireEvent.changeText(input, 'I');
        fireEvent.changeText(input, 'It');
        fireEvent.changeText(input, 'Ite');
      },
    }
  );
});

test('Dropdown — open/close cycle (×5) with 100 items', async () => {
  await measureRenders(
    <Dropdown
      testID="dropdown"
      data={data100}
      labelField="label"
      valueField="value"
      onChange={() => {}}
    />,
    {
      scenario: async () => {
        const trigger = screen.getByTestId('dropdown');
        for (let i = 0; i < 5; i++) {
          fireEvent.press(trigger);
          fireEvent.press(trigger);
        }
      },
    }
  );
});
