import React, { useId } from 'react';

type IconKotlinProps = React.SVGProps<SVGSVGElement>;

const IconKotlin = (styles: IconKotlinProps) => {
  const hash = useId();

  return (
    <svg width="28" height="29" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg" {...styles}>
      <path d="M28 29H0V1H28L14 15L28 29Z" fill={`url(#${hash}paint0_linear_211_40588)`} />
      <defs>
        <linearGradient
          id={`${hash}paint0_linear_211_40588`}
          x1="28"
          y1="0.999999"
          x2="8.34465e-07"
          y2="29"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.00343514" stop-color="#E44857" />
          <stop offset="0.4689" stop-color="#C711E1" />
          <stop offset="1" stop-color="#7F52FF" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default IconKotlin;
