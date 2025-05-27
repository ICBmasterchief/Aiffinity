// frontend/src/components/RangeSlider.js
"use client";

import { Range, getTrackBackground } from "react-range";

export default function RangeSlider({ value, onChange, MIN, MAX }) {
  return (
    <div className="px-2 py-4 w-full">
      <Range
        min={MIN}
        max={MAX}
        step={1}
        values={value}
        onChange={onChange}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            className="h-2 rounded-full"
            style={{
              background: getTrackBackground({
                values: value,
                colors: ["#d1d5db", "#a78bfa", "#d1d5db"],
                min: MIN,
                max: MAX,
              }),
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props, index }) => {
          const { key, style, ...rest } = props;
          return (
            <div
              key={key}
              {...rest}
              style={style}
              className="
                w-5 h-5 rounded-full bg-white shadow
                ring-2 ring-violet-400 cursor-grab active:cursor-grabbing
              "
            >
              <span
                className="
                  absolute -top-6 left-1/2 -translate-x-1/2
                  text-sm font-medium text-slate-700 select-none
                "
              >
                {value[index]}
              </span>
            </div>
          );
        }}
      />
    </div>
  );
}
