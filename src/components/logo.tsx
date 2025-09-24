import React from 'react';

export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="M17 3l1 4" />
      <path d="M17 21l1-4" />
      <path d="M7 3l-1 4" />
      <path d="M7 21l-1-4" />
      <path d="M4.2 8.5l-2.4 1" />
      <path d="M19.8 15.5l2.4 1" />
      <path d="M4.2 15.5l-2.4-1" />
      <path d="M19.8 8.5l2.4-1" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M12 6a6 6 0 0 0-6 6" />
      <path d="M12 18a6 6 0 0 0 6-6" />
      <path d="M12 12a3 3 0 1 0 0-0.001" />
    </svg>
  );
}
