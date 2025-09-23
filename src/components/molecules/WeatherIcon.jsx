import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const WeatherIcon = ({ condition, size = "default", className, animated = false }) => {
  const iconMap = {
    "sunny": "Sun",
    "clear-day": "Sun",
    "clear-night": "Moon",
    "partly-cloudy": "CloudSun",
    "partly-cloudy-day": "CloudSun",
    "partly-cloudy-night": "CloudMoon",
    "cloudy": "Cloud",
    "overcast": "Cloud",
    "rainy": "CloudRain",
    "rain": "CloudRain",
    "drizzle": "CloudDrizzle",
    "snowy": "CloudSnow",
    "snow": "CloudSnow",
    "thunderstorm": "Zap",
    "foggy": "Cloud",
    "windy": "Wind"
  };

  const colorMap = {
    "sunny": "text-yellow-500",
    "clear-day": "text-yellow-500",
    "clear-night": "text-indigo-400",
    "partly-cloudy": "text-yellow-400",
    "partly-cloudy-day": "text-yellow-400",
    "partly-cloudy-night": "text-indigo-300",
    "cloudy": "text-gray-500",
    "overcast": "text-gray-600",
    "rainy": "text-blue-500",
    "rain": "text-blue-500",
    "drizzle": "text-blue-400",
    "snowy": "text-blue-200",
    "snow": "text-blue-200",
    "thunderstorm": "text-purple-500",
    "foggy": "text-gray-400",
    "windy": "text-gray-600"
  };

  const sizes = {
    sm: 16,
    default: 24,
    lg: 32,
    xl: 48,
    "2xl": 64
  };

  const iconName = iconMap[condition] || "Sun";
  const iconColor = colorMap[condition] || "text-gray-500";
  const iconSize = sizes[size] || sizes.default;

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <ApperIcon 
        name={iconName} 
        size={iconSize} 
        className={cn(
          iconColor,
          animated && "transition-transform duration-300 hover:scale-110"
        )} 
      />
    </div>
  );
};

export default WeatherIcon;