
"use client";

import React from 'react';

type IconProps = {
  color?: string;
};

export const TextColorChooseIcon = ({ color = 'currentColor' }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 20 20" height="24px" viewBox="0 0 20 20" width="24px" fill={color}>
    <g><rect fill="none" height="20" width="20"/></g>
    <g><g>
      <path d="M16,16H4c-1.1,0-2,0.9-2,2s0.9,2,2,2h12c1.1,0,2-0.9,2-2S17.1,16,16,16z"/>
      <path d="M6.51,13L6.51,13c0.34,0,0.65-0.21,0.76-0.53l0.72-2.02h4.04l0.71,2.02c0.11,0.32,0.42,0.54,0.76,0.54 c0.56,0,0.95-0.56,0.75-1.09l-3.03-8.08C11.02,3.33,10.54,3,10,3S8.98,3.33,8.79,3.84l-3.03,8.08C5.56,12.44,5.95,13,6.51,13z M9.57,6.02l0.39-1.16h0.08l0.39,1.16l1.06,2.98H8.51L9.57,6.02z"/>
    </g></g>
  </svg>
);

export const BgOverlayIcon = ({ color = 'currentColor' }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill={color}><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19.58 3.08L3.15 19.51c.09.34.27.65.51.9.25.24.56.42.9.51L21 4.49c-.19-.69-.73-1.23-1.42-1.41zM11.95 3l-8.88 8.88v2.83L14.78 3h-2.83zM5.07 3c-1.1 0-2 .9-2 2v2l4-4h-2zm14 18c.55 0 1.05-.22 1.41-.59.37-.36.59-.86.59-1.41v-2l-4 4h2zm-9.71 0h2.83l8.88-8.88V9.29L9.36 21z"/></svg>
);

export const TextBgBoxIcon = ({ color = 'currentColor' }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 20 20" height="24px" viewBox="0 0 20 20" width="24px" fill={color}><g><rect fill="none" height="20" width="20"/></g><g><g><path d="M16.5,2h-10C5.67,2,5,2.67,5,3.5v10C5,14.33,5.67,15,6.5,15h10c0.83,0,1.5-0.67,1.5-1.5v-10C18,2.67,17.33,2,16.5,2z M13.41,11.62l-0.49-1.41h-2.83l-0.5,1.41C9.51,11.85,9.3,12,9.06,12h0c-0.39,0-0.67-0.39-0.53-0.76l2.12-5.65 C10.79,5.23,11.12,5,11.5,5h0c0.38,0,0.71,0.23,0.85,0.59l2.12,5.65c0.14,0.37-0.13,0.76-0.53,0.76h0 C13.7,12,13.49,11.85,13.41,11.62z"/><path d="M2.75,5L2.75,5C2.34,5,2,5.34,2,5.75V16.5C2,17.33,2.67,18,3.5,18h10.75c0.41,0,0.75-0.34,0.75-0.75l0,0 c0-0.41-0.34-0.75-0.75-0.75H3.5V5.75C3.5,5.34,3.16,5,2.75,5z"/><polygon points="11.47,6.3 10.45,9.19 12.55,9.19 11.53,6.3"/></g></g></svg>
);


export const TextBoxOpacity = () => (
  <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><g><rect fill="none" height="24" width="24"/></g><g><path d="M17.65,7.56L17.65,7.56L12.7,2.69c-0.39-0.38-1.01-0.38-1.4,0L6.35,7.56l0,0C4.9,8.99,4,10.96,4,13.13 C4,17.48,7.58,21,12,21c4.42,0,8-3.52,8-7.87C20,10.96,19.1,8.99,17.65,7.56z M7.75,8.99L12,4.81l4.25,4.18 c0.88,0.87,2.04,2.59,1.67,5.01H6.07C5.7,11.58,6.87,9.85,7.75,8.99z"/></g></svg>
);

export const FeelLucky = () => (
<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 0 24 24" width="40px" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM7.5 18c-.83 0-1.5-.67-1.5-1.5S6.67 15 7.5 15s1.5.67 1.5 1.5S8.33 18 7.5 18zm0-9C6.67 9 6 8.33 6 7.5S6.67 6 7.5 6 9 6.67 9 7.5 8.33 9 7.5 9zm4.5 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm0-9c-.83 0-1.5-.67-1.5-1.5S15.67 6 16.5 6s1.5.67 1.5 1.5S17.33 9 16.5 9z"/></svg>

);
