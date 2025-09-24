import React from "react";
import Card from "@/components/atoms/Card";
import WeatherIcon from "@/components/molecules/WeatherIcon";
import WeatherMetric from "@/components/molecules/WeatherMetric";
import { format } from "date-fns";
import { cn } from "@/utils/cn";

const CurrentWeather = ({ weather, location, className }) => {
  if (!weather || !location) return null;

  const getBackgroundGradient = (condition) => {
    const gradientMap = {
      "sunny": "bg-gradient-to-br from-yellow-300 via-orange-300 to-red-300",
      "clear-day": "bg-gradient-to-br from-yellow-300 via-orange-300 to-red-300",
      "clear-night": "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500",
      "partly-cloudy": "bg-gradient-to-br from-blue-300 via-indigo-300 to-purple-300",
      "partly-cloudy-day": "bg-gradient-to-br from-blue-300 via-indigo-300 to-purple-300",
      "partly-cloudy-night": "bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400",
      "cloudy": "bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500",
      "overcast": "bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600",
      "rainy": "bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-500",
      "rain": "bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-500",
      "snowy": "bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400",
      "thunderstorm": "bg-gradient-to-br from-purple-500 via-indigo-600 to-gray-700"
    };
    
    return gradientMap[condition] || "bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600";
  };

  return (
    <Card 
      variant="glass" 
      className={cn(
        "p-8 relative overflow-hidden",
        getBackgroundGradient(weather.condition),
        className
      )}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
      
      <div className="relative z-10">
        {/* Location and Time */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">
            {location.name}
          </h1>
          <p className="text-white/80 text-sm">
            {format(new Date(weather.timestamp), "EEEE, MMMM d, yyyy")}
          </p>
          <p className="text-white/70 text-sm">
            {format(new Date(weather.timestamp), "h:mm a")}
          </p>
        </div>

        {/* Main Weather Display */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <WeatherIcon 
              condition={weather.condition} 
              size="2xl" 
              className="mb-4"
              animated
            />
          </div>
          
          <div className="mb-4">
            <div className="text-6xl font-bold text-white mb-2">
              {Math.round(weather.temperature)}°
            </div>
<p className="text-xl text-white/90 capitalize mb-2">
              {weather.condition?.replace(/-/g, ' ')}
            </p>
            <p className="text-white/80">
              Feels like {Math.round(weather.feelsLike)}°
            </p>
          </div>
        </div>

        {/* Weather Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <WeatherMetric
            icon="Droplets"
            label="Humidity"
            value={weather.humidity}
            unit="%"
            iconColor="text-white/80"
            className="text-white"
          />
          <WeatherMetric
            icon="Wind"
            label="Wind"
            value={weather.windSpeed}
            unit="km/h"
            iconColor="text-white/80"
            className="text-white"
          />
          <WeatherMetric
            icon="Gauge"
            label="Pressure"
            value={weather.pressure}
            unit="hPa"
            iconColor="text-white/80"
            className="text-white"
          />
          <WeatherMetric
            icon="Eye"
            label="Visibility"
            value="10"
            unit="km"
            iconColor="text-white/80"
            className="text-white"
          />
        </div>
      </div>
    </Card>
  );
};

export default CurrentWeather;