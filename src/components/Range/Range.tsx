'use client';
import React, { useState, useRef, useEffect } from 'react';

interface RangeSliderProps {
    min?: number;
    max?: number;
    fixedValues?: number[];
}

export const Range = ({ min, max, fixedValues }: RangeSliderProps) => {
    const [rangeBoundary, setRangeBoundary] = useState<{ max: number; min: number }>({ max: 0, min: 0 });
    const [range, setRange] = useState<{ start: number; end: number }>({ start: 0, end: 0 });
    const [isDragging, setIsDragging] = useState<{ start: boolean; end: boolean }>({ start: false, end: false });
    const rangeRef = useRef<HTMLDivElement>(null);
    const startThumbRef = useRef<HTMLDivElement>(null);
    const endThumbRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (fixedValues) {
            const max = Math.max(...fixedValues);
            const min = Math.min(...fixedValues);

            setRange({ start: min, end: max });
            setRangeBoundary({ max, min });
        } else {
            setRange({ start: min ?? 0, end: max ?? 0 });
            setRangeBoundary({ max: max ?? 0, min: min ?? 0 });
        }
    }, []);

    useEffect(() => {
        const moveThumb = (event: MouseEvent) => {
            if (!rangeRef.current) return;
            if (isDragging.start && startThumbRef.current) startThumbRef.current.style.cursor = 'grabbing';
            if (isDragging.end && endThumbRef.current) endThumbRef.current.style.cursor = 'grabbing';

            const { clientX } = event;
            const { left, width } = rangeRef.current.getBoundingClientRect();
            const clickedPosition = Math.min(Math.max(0, clientX - left), width);
            if (fixedValues) {
                const sortedValues = fixedValues.sort((a, b) => a - b);
                const clickedValue = clickedPosition / width;
                const newValue = sortedValues.reduce((prev, curr) =>
                    Math.abs(curr - (sortedValues[0] + clickedValue * (sortedValues[sortedValues.length - 1] - sortedValues[0]))) <
                    Math.abs(prev - (sortedValues[0] + clickedValue * (sortedValues[sortedValues.length - 1] - sortedValues[0])))
                        ? curr
                        : prev
                );

                if (isDragging.start) {
                    if (newValue >= range.end) {
                        setIsDragging({ ...isDragging, start: false });
                        return;
                    }
                    setRange(prev => ({ ...prev, start: newValue }));
                } else if (isDragging.end) {
                    if (newValue <= range.start) {
                        setIsDragging({ ...isDragging, end: false });
                        return;
                    }
                    setRange(prev => ({ ...prev, end: newValue }));
                }
            } else {
                const clickedValue = clickedPosition / width;
                const newValue = +(rangeBoundary.min + (rangeBoundary.max - rangeBoundary.min) * clickedValue).toFixed(2);

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
            }
        };

        if (isDragging.start || isDragging.end) {
            window.addEventListener('mousemove', moveThumb);
            window.addEventListener('mouseup', () => {
                if (isDragging.start && startThumbRef.current) startThumbRef.current.style.cursor = 'grab';
                if (isDragging.end && endThumbRef.current) endThumbRef.current.style.cursor = 'grab';
                setIsDragging({ start: false, end: false });
            });
        }

        return () => {
            window.removeEventListener('mousemove', moveThumb);
            window.addEventListener('mouseup', () => {
                if (!isDragging.end && !isDragging.start) return;
                if (isDragging.start && startThumbRef.current) startThumbRef.current.style.cursor = 'grab';
                if (isDragging.end && endThumbRef.current) endThumbRef.current.style.cursor = 'grab';
                setIsDragging({ start: false, end: false });
            });
        };
    }, [isDragging.start, isDragging.end, min, max, range, fixedValues]);

    const startDragging = (thumb: 'start' | 'end') => () => {
        setIsDragging({ ...isDragging, [thumb]: true });
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'start' | 'end') => {
        const value = parseFloat(event.target.value.replace('€', '').trim());
        if (!isNaN(value) && value >= rangeBoundary.min && value <= rangeBoundary.max) {
            if (type === 'start' && value <= range.end) {
                setRange({ ...range, start: value });
            } else if (type === 'end' && value >= range.start) {
                setRange({ ...range, end: value });
            }
        }
    };

    return (
        <div className="flex gap-4 justify-center items-center ">
            <input
                type="text"
                disabled={fixedValues ? true : false}
                className="text-right w-20 bg-transparent appearance-none border-none focus:outline-none focus:border-none focus:ring-0 text-sm"
                value={range.start.toFixed(2) + '€'}
                onChange={e => handleInputChange(e, 'start')}
                min={min}
                max={max}
                step="0.01"
                data-testid="start-input"
            />
            <div ref={rangeRef} className="h-1 w-full bg-black rounded-full relative cursor-pointer " data-testid="range-track">
                <div
                    className="absolute top-1/2 h-3 w-3 cursor-grab rounded-full -translate-x-1/2 -translate-y-1/2 bg-black hover:scale-110"
                    style={{
                        left: `${((range.start - rangeBoundary.min) / (rangeBoundary.max - rangeBoundary.min)) * 100}%`
                    }}
                    onMouseDown={startDragging('start')}
                    data-testid="start-thumb"
                    ref={startThumbRef}
                />
                <div
                    className="absolute top-1/2 h-3 w-3 cursor-grab rounded-full -translate-x-1/2 -translate-y-1/2 bg-black hover:scale-110"
                    style={{
                        left: `${((range.end - rangeBoundary.min) / (rangeBoundary.max - rangeBoundary.min)) * 100}%`
                    }}
                    onMouseDown={startDragging('end')}
                    ref={endThumbRef}
                    data-testid="end-thumb"
                />
            </div>

            <input
                type="text"
                disabled={fixedValues ? true : false}
                className="w-20 bg-transparent appearance-none border-none focus:outline-none focus:border-none focus:ring-0 text-sm"
                value={range.end.toFixed(2) + '€'}
                onChange={e => handleInputChange(e, 'end')}
                min={min}
                max={max}
                step="0.01"
                data-testid="end-input"
            />
        </div>
    );
};
