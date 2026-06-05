"use client"

interface ToxnilLogoProps {
  variant?: "icon" | "full" | "horizontal"
  size?: "sm" | "md" | "lg" | "xl"
  darkMode?: boolean
  className?: string
}

export function ToxnilLogo({ variant = "full", size = "md", darkMode = false, className = "" }: ToxnilLogoProps) {
  // Size configurations
  const sizes = {
    sm: { icon: 32, full: 120, horizontal: 140 },
    md: { icon: 48, full: 160, horizontal: 180 },
    lg: { icon: 64, full: 200, horizontal: 220 },
    xl: { icon: 96, full: 280, horizontal: 300 },
  }

  // Colors
  const primaryGreen = darkMode ? "#4ade80" : "#1a4d3e"
  const accentGreen = darkMode ? "#86efac" : "#2d6a4f"
  const sageGreen = darkMode ? "#a7f3d0" : "#5A7A77"
  const gold = "#D4AF37"
  const textColor = darkMode ? "#ffffff" : "#1a4d3e"

  // Icon Only Version
  const IconLogo = () => (
    <svg
      width={sizes[size].icon}
      height={sizes[size].icon}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Leaf Shape */}
      <path
        d="M32 8C32 8 12 20 12 36C12 48.15 20.95 58 32 58C43.05 58 52 48.15 52 36C52 20 32 8 32 8Z"
        fill={primaryGreen}
        stroke={accentGreen}
        strokeWidth="1.5"
      />

      {/* Leaf Vein - Center */}
      <path d="M32 14V50" stroke={sageGreen} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

      {/* Leaf Veins - Sides */}
      <path
        d="M32 24L22 32M32 32L20 38M32 40L24 46"
        stroke={sageGreen}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M32 24L42 32M32 32L44 38M32 40L40 46"
        stroke={sageGreen}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* Nano Particles */}
      <circle cx="22" cy="28" r="3.5" fill={gold} opacity="0.9">
        <animate attributeName="opacity" values="0.9;0.5;0.9" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="42" cy="28" r="3" fill={gold} opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="18" cy="40" r="2.5" fill={gold} opacity="0.7">
        <animate attributeName="opacity" values="0.7;0.3;0.7" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="46" cy="40" r="2.5" fill={gold} opacity="0.75">
        <animate attributeName="opacity" values="0.75;0.35;0.75" dur="2.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="32" cy="18" r="3" fill={gold} opacity="0.85">
        <animate attributeName="opacity" values="0.85;0.45;0.85" dur="2.2s" repeatCount="indefinite" />
      </circle>

      {/* Molecular Connection Lines */}
      <path d="M22 28L32 18L42 28" stroke={gold} strokeWidth="0.75" strokeDasharray="2 2" opacity="0.5" />
      <path d="M18 40L22 28M46 40L42 28" stroke={gold} strokeWidth="0.75" strokeDasharray="2 2" opacity="0.4" />
    </svg>
  )

  // Full Version (Icon + Text Stacked)
  const FullLogo = () => (
    <svg
      width={sizes[size].full}
      height={sizes[size].full * 1.1}
      viewBox="0 0 160 176"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Leaf Shape */}
      <path
        d="M80 16C80 16 40 40 40 72C40 96.3 58.4 116 80 116C101.6 116 120 96.3 120 72C120 40 80 16 80 16Z"
        fill={primaryGreen}
        stroke={accentGreen}
        strokeWidth="2"
      />

      {/* Leaf Vein - Center */}
      <path d="M80 28V100" stroke={sageGreen} strokeWidth="2" strokeLinecap="round" opacity="0.6" />

      {/* Leaf Veins - Sides */}
      <path
        d="M80 48L60 64M80 64L56 76M80 80L64 92"
        stroke={sageGreen}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M80 48L100 64M80 64L104 76M80 80L96 92"
        stroke={sageGreen}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* Nano Particles */}
      <circle cx="52" cy="56" r="5" fill={gold} opacity="0.9">
        <animate attributeName="opacity" values="0.9;0.5;0.9" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="108" cy="56" r="4.5" fill={gold} opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="44" cy="80" r="4" fill={gold} opacity="0.7">
        <animate attributeName="opacity" values="0.7;0.3;0.7" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="116" cy="80" r="4" fill={gold} opacity="0.75">
        <animate attributeName="opacity" values="0.75;0.35;0.75" dur="2.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="80" cy="36" r="5" fill={gold} opacity="0.85">
        <animate attributeName="opacity" values="0.85;0.45;0.85" dur="2.2s" repeatCount="indefinite" />
      </circle>

      {/* Molecular Connection Lines */}
      <path d="M52 56L80 36L108 56" stroke={gold} strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
      <path d="M44 80L52 56M116 80L108 56" stroke={gold} strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />

      {/* TOXNIL Text */}
      <text
        x="80"
        y="148"
        textAnchor="middle"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="28"
        fontWeight="700"
        letterSpacing="4"
        fill={textColor}
      >
        TOXNIL
      </text>

      {/* Tagline */}
      <text
        x="80"
        y="166"
        textAnchor="middle"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="9"
        fontWeight="500"
        letterSpacing="2"
        fill={sageGreen}
        opacity="0.8"
      >
        NANO WELLNESS
      </text>
    </svg>
  )

  // Horizontal Version (Icon + Text Side by Side)
  const HorizontalLogo = () => (
    <svg
      width={sizes[size].horizontal}
      height={sizes[size].horizontal * 0.35}
      viewBox="0 0 220 77"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Leaf Shape - Smaller for horizontal */}
      <path
        d="M32 8C32 8 12 20 12 36C12 48.15 20.95 58 32 58C43.05 58 52 48.15 52 36C52 20 32 8 32 8Z"
        fill={primaryGreen}
        stroke={accentGreen}
        strokeWidth="1.5"
      />

      {/* Leaf Vein - Center */}
      <path d="M32 14V50" stroke={sageGreen} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

      {/* Leaf Veins - Sides */}
      <path
        d="M32 24L22 32M32 32L20 38M32 40L24 46"
        stroke={sageGreen}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M32 24L42 32M32 32L44 38M32 40L40 46"
        stroke={sageGreen}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* Nano Particles */}
      <circle cx="22" cy="28" r="3.5" fill={gold} opacity="0.9">
        <animate attributeName="opacity" values="0.9;0.5;0.9" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="42" cy="28" r="3" fill={gold} opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="18" cy="40" r="2.5" fill={gold} opacity="0.7">
        <animate attributeName="opacity" values="0.7;0.3;0.7" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="46" cy="40" r="2.5" fill={gold} opacity="0.75">
        <animate attributeName="opacity" values="0.75;0.35;0.75" dur="2.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="32" cy="18" r="3" fill={gold} opacity="0.85">
        <animate attributeName="opacity" values="0.85;0.45;0.85" dur="2.2s" repeatCount="indefinite" />
      </circle>

      {/* Molecular Connection Lines */}
      <path d="M22 28L32 18L42 28" stroke={gold} strokeWidth="0.75" strokeDasharray="2 2" opacity="0.5" />

      {/* TOXNIL Text */}
      <text
        x="72"
        y="42"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="32"
        fontWeight="700"
        letterSpacing="3"
        fill={textColor}
      >
        TOXNIL
      </text>

      {/* Tagline */}
      <text
        x="72"
        y="58"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="10"
        fontWeight="500"
        letterSpacing="1.5"
        fill={sageGreen}
        opacity="0.8"
      >
        NANO WELLNESS
      </text>
    </svg>
  )

  // Return appropriate variant
  if (variant === "icon") return <IconLogo />
  if (variant === "horizontal") return <HorizontalLogo />
  return <FullLogo />
}

// Static SVG exports for favicon and other uses
export const ToxnilFavicon = `
<svg width="32" height="32" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M32 8C32 8 12 20 12 36C12 48.15 20.95 58 32 58C43.05 58 52 48.15 52 36C52 20 32 8 32 8Z" fill="#1a4d3e" stroke="#2d6a4f" strokeWidth="1.5"/>
  <path d="M32 14V50" stroke="#5A7A77" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
  <circle cx="22" cy="28" r="3.5" fill="#D4AF37" opacity="0.9"/>
  <circle cx="42" cy="28" r="3" fill="#D4AF37" opacity="0.8"/>
  <circle cx="18" cy="40" r="2.5" fill="#D4AF37" opacity="0.7"/>
  <circle cx="46" cy="40" r="2.5" fill="#D4AF37" opacity="0.75"/>
  <circle cx="32" cy="18" r="3" fill="#D4AF37" opacity="0.85"/>
</svg>
`
