
"use client";

import React from 'react';

type IconProps = {
  path?: string;
  d?: string;
  polygon?: string;
  size?: number;
  className?: string;
  viewBox?: string;
  fill?: string;
};

export function Icon({ path, d, polygon, size = 24, className, viewBox = '0 0 24 24', fill = 'currentColor' }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={viewBox}
      fill={fill}
      className={className}
    >
      {path && <path d={path} />}
      {d && <path d={d} />}
      {polygon && <polygon points={polygon} />}
    </svg>
  );
}

    