import React, { useEffect, useState } from "react";
import { locationService, weatherService } from "@/services/api/weatherService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import WeeklyForecast from "@/components/organisms/WeeklyForecast";
import LocationSelector from "@/components/organisms/LocationSelector";
import HourlyForecast from "@/components/organisms/HourlyForecast";
import CurrentWeather from "@/components/organisms/CurrentWeather";
import Button from "@/components/atoms/Button";
import { initializeApperClient } from "@/services/api/weatherService";

const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    setInitializing(true);
    try {
      // Initialize ApperClient in services
      await initializeApperClient();
      
      // Check for previously saved location
      const savedLocation = await locationService.getCurrent();
      if (savedLocation) {
        setCurrentLocation(savedLocation);
        await loadWeatherData(savedLocation);
      }
    } catch (err) {
      console.error("Failed to initialize app:", err);
      toast.error("Failed to initialize weather service");
    } finally {
      setInitializing(false);
    }
  };

  const loadWeatherData = async (location) => {
    setLoading(true);
    setError(null);
    try {
      const weather = await weatherService.getLocationWeather(location);
      setWeatherData(weather);
    } catch (err) {
      console.error("Failed to load weather data:", err);
      setError(err.message || "Failed to load weather data");
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationChange = async (location) => {
    setCurrentLocation(location);
    await loadWeatherData(location);
    toast.success(`Weather loaded for ${location.name}`);
  };

  const handleRefresh = async () => {
    if (!currentLocation) return;
    
    setRefreshing(true);
    try {
      await loadWeatherData(currentLocation);
      toast.success("Weather data updated!");
    } catch (err) {
      console.error("Failed to refresh:", err);
      toast.error("Failed to refresh weather data");
    } finally {
      setRefreshing(false);
    }
  };

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

  if (initializing) {
    return <Loading />;
  }

  if (error && !currentLocation) {
    return <Error message={error} onRetry={initializeApp} />;
  }

  // Show search interface when no location is selected
  if (!currentLocation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
        {/* Header */}
        <div className="max-w-lg mx-auto pt-12 px-4">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Cloud" size={28} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">SkyView Weather</h1>
            <p className="text-gray-600">Search for a city to get started with accurate weather forecasts</p>
          </div>

          {/* Location Search */}
          <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20">
            <LocationSelector
              currentLocation={null}
              onLocationChange={handleLocationChange}
              className="space-y-4"
            />
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-white/50 backdrop-blur-md rounded-2xl p-4 text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <ApperIcon name="Clock" size={18} className="text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-800">Hourly Forecast</p>
              <p className="text-xs text-gray-600">24-hour predictions</p>
            </div>
            <div className="bg-white/50 backdrop-blur-md rounded-2xl p-4 text-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <ApperIcon name="Calendar" size={18} className="text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-800">7-Day Forecast</p>
              <p className="text-xs text-gray-600">Weekly planning</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main weather dashboard
  return (
    <div className={`min-h-screen transition-all duration-500 ${weatherData ? getBackgroundClass(weatherData.current.condition) : 'bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100'}`}>
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
              onClick={() => setCurrentLocation(null)}
              className="p-2"
              title="Change Location"
            >
              <ApperIcon name="MapPin" size={18} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing || loading}
              className="p-2"
              title="Refresh Weather"
            >
              <ApperIcon 
                name="RefreshCw" 
                size={18} 
                className={refreshing ? "animate-spin" : ""} 
              />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-lg mx-auto px-4 pb-8 space-y-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loading />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
            <ApperIcon name="AlertCircle" size={24} className="text-red-500 mx-auto mb-2" />
            <p className="text-red-800 font-medium">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleRefresh()}
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        ) : weatherData ? (
          <>
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
                Tap refresh to update • SkyView Weather
              </p>
            </div>
          </>
        ) : (
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 text-center">
            <ApperIcon name="Search" size={32} className="text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No weather data available</p>
            <p className="text-sm text-gray-500 mt-1">Please search for a city</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherDashboard;