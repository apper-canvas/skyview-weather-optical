import React from "react";
import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import WeatherIcon from "@/components/molecules/WeatherIcon";

const HourlyForecast = ({ hourlyData, className }) => {
  if (!hourlyData || hourlyData.length === 0) return null;

  return (
    <div className={className}>
    <h2 className="text-lg font-semibold text-gray-900 mb-4">Hourly Forecast
              </h2>
    <Card variant="glass" className="p-4">
        <div className="flex gap-4 overflow-x-auto pb-2">
            {hourlyData.map(hour => <div
                key={hour?.Id || hour?.hour || Math.random()}
                className="flex-shrink-0 text-center min-w-[80px] py-3 px-2 rounded-xl hover:bg-white/20 transition-all duration-200">
                <p className="text-sm text-white/70 mb-2 font-medium">
                    <div className="text-sm font-medium text-gray-700 mb-3">
                        {format(new Date(hour.hour), "h a")}
                    </div>
                    {/* Weather Icon */}
                    <div className="mb-3">
                        <WeatherIcon condition={hour.condition} size="default" animated />
                    </div>
                    {/* Temperature */}
                    <div className="text-lg font-semibold text-gray-900 mb-2">
                        {Math.round(hour.temperature)}°
                                      </div>
                    {/* Precipitation Chance */}
                    {hour.precipitationChance > 0 && <div className="text-xs text-blue-600 font-medium">
                        {hour.precipitationChance}%
                                        </div>}
                </p></div>)}
        </div>
    </Card>
</div>
  );
};

export default HourlyForecast;