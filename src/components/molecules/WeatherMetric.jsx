import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const WeatherMetric = ({ 
  icon, 
  label, 
  value, 
  unit,
  className,
  iconColor = "text-gray-600"
}) => {
  return (
    <div className={cn("text-center", className)}>
      <div className="flex items-center justify-center mb-2">
        <ApperIcon 
          name={icon} 
          size={20} 
          className={iconColor}
        />
      </div>
      <div className="text-lg font-semibold text-gray-900 mb-1">
        {value}
        {unit && <span className="text-sm text-gray-600 ml-1">{unit}</span>}
      </div>
      <div className="text-xs text-gray-600 uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
};

export default WeatherMetric;