"use client";

interface AgentAvatarProps {
  name: string;
  category: string;
  size?: number;
}

export function AgentAvatar({ name, category, size = 40 }: AgentAvatarProps) {
  // Generate unique pattern based on name
  const seed = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Color schemes by category
  const colors: Record<string, string[]> = {
    trading: ["#00ec97", "#10b981", "#059669"],
    chat: ["#3b82f6", "#60a5fa", "#1d4ed8"],
    analytics: ["#8b5cf6", "#a78bfa", "#7c3aed"],
    other: ["#f59e0b", "#fbbf24", "#d97706"],
  };
  
  const palette = colors[category] || colors.other;
  
  // Generate geometric pattern
  const pattern = seed % 4;
  const rotation = (seed * 45) % 360;
  
  return (
    <div 
      className="relative flex items-center justify-center overflow-hidden rounded-xl"
      style={{ 
        width: size, 
        height: size,
        background: `linear-gradient(135deg, ${palette[0]}20, ${palette[1]}20)`,
        border: `1px solid ${palette[0]}40`,
      }}
    >
      {/* Geometric pattern based on seed */}
      <svg 
        width={size * 0.6} 
        height={size * 0.6} 
        viewBox="0 0 24 24" 
        fill="none"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {pattern === 0 && (
          // Hexagon pattern
          <>
            <path 
              d="M12 2L20 7V17L12 22L4 17V7L12 2Z" 
              stroke={palette[0]} 
              strokeWidth="1.5"
              fill={`${palette[0]}30`}
            />
            <circle cx="12" cy="12" r="3" fill={palette[1]} />
          </>
        )}
        {pattern === 1 && (
          // Triangle network
          <>
            <path 
              d="M12 3L20 19H4L12 3Z" 
              stroke={palette[0]} 
              strokeWidth="1.5"
              fill={`${palette[0]}20`}
            />
            <circle cx="12" cy="12" r="2" fill={palette[1]} />
            <circle cx="12" cy="18" r="1.5" fill={palette[2]} />
          </>
        )}
        {pattern === 2 && (
          // Circular nodes
          <>
            <circle cx="12" cy="12" r="8" stroke={palette[0]} strokeWidth="1.5" fill="none" />
            <circle cx="12" cy="6" r="2" fill={palette[1]} />
            <circle cx="18" cy="14" r="2" fill={palette[1]} />
            <circle cx="6" cy="14" r="2" fill={palette[1]} />
            <path d="M12 8L16 13H8L12 8Z" fill={palette[2]} />
          </>
        )}
        {pattern === 3 && (
          // Diamond pulse
          <>
            <rect 
              x="4" y="4" 
              width="16" height="16" 
              rx="2" 
              stroke={palette[0]} 
              strokeWidth="1.5"
              fill={`${palette[0]}15`}
              transform="rotate(45 12 12)"
            />
            <circle cx="12" cy="12" r="3" fill={palette[1]} />
          </>
        )}
      </svg>
      
      {/* Glow effect */}
      <div 
        className="absolute inset-0 opacity-50"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${palette[0]}30, transparent 60%)`,
        }}
      />
    </div>
  );
}
