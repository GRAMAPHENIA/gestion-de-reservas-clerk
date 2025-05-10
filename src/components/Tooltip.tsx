import { useState, useEffect } from "react";
import "./Tooltip.css";

interface TooltipProps {
  children: React.ReactNode;
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export default function Tooltip({ children, text, position = 'bottom' }: TooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showAnimation, setShowAnimation] = useState(false);

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const positions = {
      top: { x: rect.left + rect.width / 2, y: rect.top - 50 },
      bottom: { x: rect.left + rect.width / 2, y: rect.top + rect.height + 10 },
      left: { x: rect.left - 100, y: rect.top + rect.height / 2 },
      right: { x: rect.left + rect.width + 10, y: rect.top + rect.height / 2 }
    };

    setTooltipPosition(positions[position]);
    setShowTooltip(true);
    setShowAnimation(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
    setShowAnimation(false);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {showTooltip && (
        <div
          className={`fixed bg-zinc-800/50 backdrop-blur-sm text-gray-200 px-4 py-2 border border-zinc-800 rounded-lg text-sm whitespace-nowrap shadow-sm z-50 ${showAnimation ? 'tooltip-slide-in' : ''}`}
          style={{
            left: tooltipPosition.x - 80,
            top: tooltipPosition.y,
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
}
