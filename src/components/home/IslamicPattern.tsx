export function IslamicPattern({ className = '', color = '#EEF0EF' }: { className?: string; color?: string }) {
  const stroke = 'rgba(230,231,230,0.9)';
  return (
    <svg className={className} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
      <defs>
        <pattern id="islamic-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill={color} />
          <circle cx="10" cy="10" r="1.5" fill={color} />
          <path d="M0 10 C5 0, 15 0, 20 10" stroke={stroke} strokeWidth="0.5" fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
    </svg>
  );
}
