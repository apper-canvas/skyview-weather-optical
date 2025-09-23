import React from "react";
import Card from "@/components/atoms/Card";
import WeatherIcon from "@/components/molecules/WeatherIcon";
import ApperIcon from "@/components/ApperIcon";
import { format, isToday, isTomorrow } from "date-fns";

const WeeklyForecast = ({ forecastData, className }) => {
  if (!forecastData || forecastData.length === 0) return null;

  const getDayLabel = (date) => {
    const forecastDate = new Date(date);
    if (isToday(forecastDate)) return "Today";
    if (isTomorrow(forecastDate)) return "Tomorrow";
    return format(forecastDate, "EEEE");
  };

  return (
    <div className={className}>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        7-Day Forecast
      </h2>
      
      <Card variant="glass" className="p-4">
        <div className="space-y-1">
          {forecastData.map((day) => (
            <div
              key={day.Id}
              className="flex items-center justify-between py-4 px-2 rounded-xl hover:bg-white/20 transition-all duration-200 group"
            >
              {/* Day and Icon */}
              <div className="flex items-center gap-4 flex-1">
                <div className="min-w-[80px]">
                  <div className="font-medium text-gray-900">
                    {getDayLabel(day.date)}
                  </div>
                  <div className="text-sm text-gray-600 capitalize">
                    {day.condition.replace("-", " ")}
                  </div>
                </div>
                
                <WeatherIcon 
                  condition={day.condition} 
                  size="lg"
                  animated
                />
              </div>
              
              {/* Precipitation */}
              {day.precipitationChance > 0 && (
                <div className="flex items-center gap-1 text-blue-600 min-w-[60px]">
                  <ApperIcon name="Droplets" size={14} />
                  <span className="text-sm font-medium">
                    {day.precipitationChance}%
                  </span>
                </div>
              )}
              
              {/* Temperatures */}
              <div className="flex items-center gap-3 min-w-[80px] justify-end">
                <span className="text-lg font-semibold text-gray-900">
                  {Math.round(day.highTemp)}°
                </span>
                <span className="text-lg text-gray-500">
                  {Math.round(day.lowTemp)}°
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default WeeklyForecast;