import React from 'react';

export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9.1 5.2c-1.3 1.3-1.3 3.4 0 4.7l-4.2 4.2C2.1 17 2.1 20.3 4.9 23c2.8 2.8 6.2.8 6.2.8s2-3.4.8-6.2l4.2-4.2c1.3 1.3 3.4 1.3 4.7 0 1.3-1.3.3-4.7 0-4.7-1.3-1.3-3.4-1.3-4.7 0l-1-1c-1.3-1.3-3.4-1.3-4.7 0-1.3 1.3-1.3 3.4 0 4.7l-1 1c-1.3-1.3-3.4-1.3-4.7 0-1.3 1.3-.3 4.7 0 4.7" />
    </svg>
  );
}
