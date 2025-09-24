import React, { useState, useEffect } from "react";
import CurrentWeather from "@/components/organisms/CurrentWeather";
import HourlyForecast from "@/components/organisms/HourlyForecast";
import WeeklyForecast from "@/components/organisms/WeeklyForecast";
import LocationSelector from "@/components/organisms/LocationSelector";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { weatherService, locationService } from "@/services/api/weatherService";
import { toast } from "react-toastify";

const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showLocationSelector, setShowLocationSelector] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    setLoading(true);
    setError(null);

    try {
// Get current saved location
      const location = await locationService.getCurrent();
      
      if (!location) {
        // No current location saved, show location selector
        setCurrentLocation(null);
        setWeatherData(null);
        setShowLocationSelector(true);
        setLoading(false);
        return;
      }

      setCurrentLocation(location);
      
      // Load weather data for current location
      await loadWeatherData(location.id);
      
    } catch (err) {
      console.error("Failed to initialize app:", err);
      setError(err.message || "Failed to load weather data");
    } finally {
      setLoading(false);
    }
  };

const loadWeatherData = async (locationId) => {
    try {
      setError(null);
      const weather = await weatherService.getLocationWeather(locationId);
      setWeatherData(weather);
    } catch (err) {
      console.error("Failed to load weather data:", err);
      setError(err.message || "Failed to load weather data");
      setWeatherData(null);
    }
  };

  const handleLocationChange = async (location) => {
// Update current location state
    setCurrentLocation(location);
    setShowLocationSelector(false);
    
    // Load weather data for new location
    setLoading(true);
    await loadWeatherData(location.id);
    setLoading(false);
  };

  const handleRefresh = async () => {
    if (!currentLocation) return;
    
    setRefreshing(true);
try {
      if (currentLocation?.id) {
        await loadWeatherData(currentLocation.id);
      }
      toast.success("Weather data updated!");
    } catch (err) {
      toast.error("Failed to refresh weather data");
    } finally {
      setRefreshing(false);
    }
  };

  const handleEnableLocation = () => {
    setShowLocationSelector(true);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={initializeApp} />;
  }

if (!currentLocation || !weatherData) {
    return (
      <Empty
        title="Welcome to SkyView"
        description="Search and save locations to get started with accurate weather forecasts for your daily planning."
        actionText="Choose Location"
        onAction={handleEnableLocation}
      />
    );
  }

  const getBackgroundClass = (condition) => {
    const backgroundMap = {
      "sunny": "bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50",
      "clear-day": "bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50",
      "clear-night": "bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100",
      "partly-cloudy": "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50",
      "partly-cloudy-day": "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50",
      "partly-cloudy-night": "bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100",
      "cloudy": "bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300",
      "overcast": "bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400",
      "rainy": "bg-gradient-to-br from-blue-100 via-blue-200 to-indigo-200",
      "rain": "bg-gradient-to-br from-blue-100 via-blue-200 to-indigo-200",
      "snowy": "bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200",
      "thunderstorm": "bg-gradient-to-br from-purple-200 via-indigo-300 to-gray-400"
    };
    
    return backgroundMap[condition] || "bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100";
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${getBackgroundClass(weatherData.current.condition)}`}>
      {/* Header */}
      <div className="max-w-lg mx-auto pt-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
              <ApperIcon name="Cloud" size={20} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">SkyView</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLocationSelector(!showLocationSelector)}
              className="p-2"
            >
              <ApperIcon name="MapPin" size={18} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2"
            >
              <ApperIcon 
                name="RefreshCw" 
                size={18} 
                className={refreshing ? "animate-spin" : ""} 
              />
            </Button>
          </div>
        </div>

        {/* Location Selector */}
        {showLocationSelector && (
          <div className="mb-6 animate-slide-up">
            <LocationSelector
              currentLocation={currentLocation}
              onLocationChange={handleLocationChange}
            />
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-lg mx-auto px-4 pb-8 space-y-6">
        {/* Current Weather */}
        <CurrentWeather
          weather={weatherData.current}
          location={currentLocation}
          className="animate-fade-in"
        />

        {/* Hourly Forecast */}
        <HourlyForecast
          hourlyData={weatherData.hourly}
          className="animate-slide-up"
        />

        {/* Weekly Forecast */}
        <WeeklyForecast
          forecastData={weatherData.forecast}
          className="animate-slide-up"
        />

        {/* Footer */}
        <div className="text-center pt-6 pb-4">
          <p className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Pull to refresh • SkyView Weather
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;