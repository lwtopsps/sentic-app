import type { HTMLAttributes } from 'react';

type SenticLogoProps = HTMLAttributes<HTMLSpanElement> & {
  className?: string;
};

export default function SenticLogo({ className = '', ...props }: SenticLogoProps) {
  return (
    <span
      {...props}
      className={className}
      style={{
        ...props.style,
        fontWeight: 700,
        fontFamily: 'Georgia, Times New Roman, serif',
      }}
    >
      <span style={{ fontStyle: 'normal' }}>S</span>
      <span style={{ fontStyle: 'italic' }}>ENTI</span>
      <span style={{ fontStyle: 'normal' }}>C</span>
    </span>
  );
}