export function HeartDoodle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 110" fill="none" {...props}>
      <title>Heart doodle</title>
      <path
        d="M60 100C20 74 8 56 8 38C8 22 20 10 36 10C46 10 55 16 60 24C65 16 74 10 84 10C100 10 112 22 112 38C112 56 100 74 60 100Z"
        stroke="#e85d79"
        strokeWidth="6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SparkleDoodle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" fill="none" {...props}>
      <title>Sparkle doodle</title>
      <path
        d="M50 8L58 42L92 50L58 58L50 92L42 58L8 50L42 42L50 8Z"
        stroke="#f2c94c"
        strokeWidth="5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CameraDoodle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 90" fill="none" {...props}>
      <title>Camera doodle</title>
      <path
        d="M20 25H38L45 15H75L82 25H100C105 25 110 30 110 35V70C110 75 105 80 100 80H20C15 80 10 75 10 70V35C10 30 15 25 20 25Z"
        stroke="#222"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <circle cx="60" cy="53" r="16" stroke="#222" strokeWidth="5" />
      <path
        d="M95 40H100"
        stroke="#222"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}
