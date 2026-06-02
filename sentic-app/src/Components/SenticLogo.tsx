import localFont from 'next/font/local';
import type { HTMLAttributes } from 'react';

// Using the exact path to your app/fonts folder
const editorsNote = localFont({
  src: [
    {
      path: '../../app/fonts/EditorsNote-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../app/fonts/EditorsNote-BoldItalic.otf',
      weight: '700',
      style: 'italic',
    }
  ]
});

type SenticLogoProps = HTMLAttributes<HTMLSpanElement> & {
  className?: string;
};

export default function SenticLogo({ className = '', ...props }: SenticLogoProps) {
  return (
    <span
      {...props}
      className={`${editorsNote.className} ${className}`.trim()}
      // Notice we removed the dark color so it can be white/light in the sports theme
      style={{ ...props.style, fontWeight: 700 }}
    >
      <span style={{ fontStyle: 'normal' }}>S</span>
      <span style={{ fontStyle: 'italic' }}>ENTI</span>
      <span style={{ fontStyle: 'normal' }}>C</span>
    </span>
  );
}