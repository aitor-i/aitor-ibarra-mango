'use client'
import React, { useState, useRef, useEffect } from 'react';

interface RangeSliderProps {
  min: number;
  max: number;
}

export const Range = ({ min, max }: RangeSliderProps) => {
  const [range, setRange] = useState<{ start: number; end: number }>({ start: min, end: max });
  const [isDragging, setIsDragging] = useState<{ start: boolean; end: boolean }>({ start: false, end: false });
  const rangeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const moveThumb = (event: MouseEvent) => {
      if (!rangeRef.current) return;

      const { clientX } = event;
      const { left, width } = rangeRef.current.getBoundingClientRect();
      const clickedPosition = Math.min(Math.max(0, clientX - left), width);
      const clickedValue = clickedPosition / width;
      const newValue = +(min + (max - min) * clickedValue).toFixed(2);

      if (isDragging.start) {
        if (newValue > range.end) {
          setIsDragging({ ...isDragging, start: false });
          return;
        }
        setRange({ ...range, start: newValue });
      } else if (isDragging.end) {
        if (newValue < range.start) {
          setIsDragging({ ...isDragging, end: false });
          return;
        }
        setRange({ ...range, end: newValue });
      }
    };

    if (isDragging.start || isDragging.end) {
      window.addEventListener('mousemove', moveThumb);
      window.addEventListener('mouseup', () => setIsDragging({ start: false, end: false }));
    }

    return () => {
      window.removeEventListener('mousemove', moveThumb);
      window.removeEventListener('mouseup', () => setIsDragging({ start: false, end: false }));
    };
  }, [isDragging, min, max, range]);

  const startDragging = (thumb: 'start' | 'end') => () => {
    setIsDragging({ ...isDragging, [thumb]: true });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'start' | 'end') => {
    const value = parseFloat(event.target.value.replace('€', '').trim());
    if (!isNaN(value) && value >= min && value <= max) {
      if (type === 'start' && value <= range.end) {
        setRange({ ...range, start: value });
      } else if (type === 'end' && value >= range.start) {
        setRange({ ...range, end: value });
      }
    }
  };

  return (
    <div className='flex gap-4 justify-center items-center '>
      <input
        type="text"
        className='text-right w-20 bg-transparent appearance-none border-none focus:outline-none focus:border-none focus:ring-0 text-sm'
        value={range.start.toFixed(2) + '€'}
        onChange={(e) => handleInputChange(e, 'start')}
        min={min}
        max={max}
        step="0.01"
        data-testid="start-input"
      />
      <div
        ref={rangeRef}
        className='h-1 w-full bg-black rounded-full relative cursor-pointer '
        data-testid="range-track"
      >
        <div
          className='absolute top-1/2 h-3 w-3 cursor-grab rounded-full -translate-x-1/2 -translate-y-1/2 bg-black hover:scale-110'
          style={{
            left: `${((range.start - min) / (max - min)) * 100}%`,
          }}
          onMouseDown={startDragging('start')}
          data-testid="start-thumb"
        />
        <div
          className='absolute top-1/2 h-3 w-3 cursor-grab rounded-full -translate-x-1/2 -translate-y-1/2 bg-black hover:scale-110'
          style={{
            left: `${((range.end - min) / (max - min)) * 100}%`,
          }}
          onMouseDown={startDragging('end')}
          data-testid="end-thumb"
        />
      </div>

      <input
        type="text"
        className='w-20 bg-transparent appearance-none border-none focus:outline-none focus:border-none focus:ring-0 text-sm'
        value={range.end.toFixed(2) + '€'}
        onChange={(e) => handleInputChange(e, 'end')}
        min={min}
        max={max}
        step="0.01"
        data-testid="end-input"
      />
    </div>
  );
};
