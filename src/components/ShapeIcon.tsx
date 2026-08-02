import React from "react";
import { ShapeType } from "../types";

interface ShapeIconProps {
  shape: ShapeType;
  size?: number;
  color?: string;
  className?: string;
}

export const ShapeIcon: React.FC<ShapeIconProps> = ({
  shape,
  size = 64,
  color = "#3B82F6",
  className = "",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`inline-block ${className}`}
    >
      {shape === "circle" && (
        <circle cx="50" cy="50" r="42" fill={color} />
      )}

      {shape === "square" && (
        <rect x="12" y="12" width="76" height="76" rx="8" fill={color} />
      )}

      {shape === "triangle" && (
        <polygon points="50,10 90,88 10,88" fill={color} />
      )}

      {shape === "rectangle" && (
        <rect x="8" y="24" width="84" height="52" rx="8" fill={color} />
      )}

      {shape === "star" && (
        <polygon
          points="50,8 63,35 93,38 71,58 78,88 50,72 22,88 29,58 7,38 37,35"
          fill={color}
        />
      )}

      {shape === "oval" && (
        <ellipse cx="50" cy="50" rx="42" ry="28" fill={color} />
      )}

      {shape === "heart" && (
        <path
          d="M 50 88 C 20 62 8 46 8 30 C 8 16 18 8 31 8 C 40 8 46 13 50 18 C 54 13 60 8 69 8 C 82 8 92 16 92 30 C 92 46 80 62 50 88 Z"
          fill={color}
        />
      )}
    </svg>
  );
};
