import { useState, useEffect } from "react";
import "./Tooltip.css";

interface TooltipProps {
  children: React.ReactNode;
  text: string;
}

export default function Tooltip({ children, text }: TooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showAnimation, setShowAnimation] = useState(false);

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + 50,
    });
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
