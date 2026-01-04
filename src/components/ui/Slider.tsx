import React from 'react';
import { cn } from '@/lib/utils';

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  min?: number;
  max?: number;
  step?: number;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, label, min = 0, max = 1, step = 0.1, ...props }, ref) => {
    return (
      <div className="space-y-3">
        {label && (
          <div className="flex justify-between items-center">
             <label className="text-sm font-medium text-slate-400 ml-1">
              {label}
            </label>
            <span className="text-xs font-mono text-electric-blue bg-electric-blue/10 px-2 py-0.5 rounded-md border border-electric-blue/20">
              {props.value}
            </span>
          </div>
        )}
        <div className="relative flex items-center select-none touch-none w-full h-5">
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              ref={ref}
              className={cn(
                "w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-electric-blue/50",
                "accent-electric-blue",
                className
              )}
              {...props}
            />
        </div>
      </div>
    );
  }
);

Slider.displayName = "Slider";

export default Slider;
