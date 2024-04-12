import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Range } from './Range';

describe('Range Component', () => {
  test('renders with default range values', () => {
    render(<Range min={0} max={100} />);
    const startInput = screen.getByDisplayValue('0.00€');
    const endInput = screen.getByDisplayValue('100.00€');
    expect(startInput).toBeInTheDocument();
    expect(endInput).toBeInTheDocument();
  });

  test('allows input to change range values without crossing', () => {
    render(<Range min={0} max={100} />);
    const startInput = screen.getByDisplayValue('0.00€');
    const endInput = screen.getByDisplayValue('100.00€');

    fireEvent.change(startInput, { target: { value: '20.00€' } });
    expect(startInput).toHaveValue('20.00€');
    expect(endInput).toHaveValue('100.00€');

    fireEvent.change(startInput, { target: { value: '120.00€' } });
    expect(startInput).toHaveValue('20.00€');

    fireEvent.change(endInput, { target: { value: '80.00€' } });
    expect(endInput).toHaveValue('80.00€');

    fireEvent.change(endInput, { target: { value: '10.00€' } });
    expect(endInput).toHaveValue('80.00€');
  });

  test('handles min range drag', () => {
    render(<Range min={0} max={100} />);
    const startThumb = screen.getByTestId('start-thumb');
    const rangeTrack = screen.getByTestId('range-track');
    const startInput = screen.getByDisplayValue('0.00€');

    const rangeWidth = 300;
    rangeTrack.getBoundingClientRect = jest.fn(() => ({
      left: 0,
      width: rangeWidth
    }));

    fireEvent.mouseDown(startThumb, { clientX: 0 });

    const moveTo = rangeWidth * 0.55;
    fireEvent.mouseMove(window, { clientX: moveTo });
    fireEvent.mouseUp(window);

    expect(startInput).toHaveValue('55.00€')
  });

  test('handles max range drag', () => {
    render(<Range min={0} max={100} />);
    const endThumb = screen.getByTestId('end-thumb');
    const rangeTrack = screen.getByTestId('range-track');
    const endInput = screen.getByDisplayValue('100.00€');

    const rangeWidth = 300;
    rangeTrack.getBoundingClientRect = jest.fn(() => ({
      left: 0,
      width: rangeWidth
    }));

    fireEvent.mouseDown(endThumb, { clientX: rangeWidth });

    const moveTo = rangeWidth * 0.55;
    fireEvent.mouseMove(window, { clientX: moveTo });
    fireEvent.mouseUp(window);

    expect(endInput).toHaveValue('55.00€')
  });

  test('prevents input less than minimum and more than maximum values', () => {
    const min = 0;
    const max = 100;
    render(<Range min={min} max={max} />);
    const startInput = screen.getByDisplayValue('0.00€');
    const endInput = screen.getByDisplayValue('100.00€');

    fireEvent.change(startInput, { target: { value: '-10.00€' } });
    fireEvent.blur(startInput);
    expect(startInput).toHaveValue('0.00€');

    fireEvent.change(endInput, { target: { value: '150.00€' } });
    fireEvent.blur(endInput);
    expect(endInput).toHaveValue('100.00€');
  });

  test('ensures start value cannot exceed end value and vice versa', () => {
    const min = 10;
    const max = 100;
    render(<Range min={min} max={max} />);
    const maxRangeValue = screen.getByDisplayValue('100.00€');
    const minRangeValue = screen.getByDisplayValue('10.00€');

    fireEvent.change(minRangeValue, { target: { value: '50.00€' } });
    fireEvent.blur(minRangeValue);
    fireEvent.change(maxRangeValue, { target: { value: '40.00€' } });
    fireEvent.blur(maxRangeValue);
    expect(maxRangeValue).toHaveValue('100.00€');
    expect(minRangeValue).toHaveValue('50.00€');

    fireEvent.change(maxRangeValue, { target: { value: '60.00€' } });
    fireEvent.blur(maxRangeValue);
    fireEvent.change(minRangeValue, { target: { value: '70.00€' } });
    fireEvent.blur(minRangeValue);
    expect(minRangeValue).toHaveValue('50.00€');
    expect(maxRangeValue).toHaveValue('60.00€');
  });

  test('it should set max and min values on fixed range', () => {
    const fixedRanges = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99]
    render(<Range fixedValues={fixedRanges} />);
    const minRangeValue = screen.getByDisplayValue('1.99€');
    const maxRangeValue = screen.getByDisplayValue('70.99€');

    expect(minRangeValue).toHaveValue('1.99€');
    expect(maxRangeValue).toHaveValue('70.99€');
  });

  test('it should move end value to next bigest fixed value', () => {
    const fixedRanges = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99]
    render(<Range fixedValues={fixedRanges} />);
    const endInput = screen.getByDisplayValue('70.99€');

    const endThumb = screen.getByTestId('end-thumb');
    const rangeTrack = screen.getByTestId('range-track');

    const rangeWidth = 300;
    rangeTrack.getBoundingClientRect = jest.fn(() => ({
      left: 0,
      width: rangeWidth
    }));

    fireEvent.mouseDown(endThumb, { clientX: rangeWidth });

    const moveTo = rangeWidth * 0.7;
    fireEvent.mouseMove(window, { clientX: moveTo });
    fireEvent.mouseUp(window);

    expect(endInput).toHaveValue('50.99€')
  });
});
