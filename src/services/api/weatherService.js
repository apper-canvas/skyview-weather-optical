import weatherData from "@/services/mockData/weather.json";
import locationsData from "@/services/mockData/locations.json";
import forecastsData from "@/services/mockData/forecasts.json";
import hourlyForecastsData from "@/services/mockData/hourlyForecasts.json";

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Weather data store
let weather = [...weatherData];
let locations = [...locationsData];
let forecasts = [...forecastsData];
let hourlyForecasts = [...hourlyForecastsData];

export const weatherService = {
  // Get current weather for a location
  async getCurrentWeather(locationId) {
    await delay(300);
    
    if (!locationId) {
      throw new Error("Location ID is required");
    }

    const currentWeather = weather.find(w => w.locationId === locationId);
    if (!currentWeather) {
      throw new Error("Weather data not found for this location");
    }

    // Add some randomness to make it feel more realistic
    const variation = (Math.random() - 0.5) * 4; // ±2 degrees
    return {
      ...currentWeather,
      temperature: Math.round(currentWeather.temperature + variation),
      feelsLike: Math.round(currentWeather.feelsLike + variation),
      timestamp: new Date().toISOString()
    };
  },

  // Get 7-day forecast for a location
  async getForecast(locationId, days = 7) {
    await delay(250);
    
    if (!locationId) {
      throw new Error("Location ID is required");
    }

    const locationForecasts = forecasts
      .filter(f => f.locationId === locationId)
      .slice(0, days)
      .map(forecast => ({
        ...forecast,
        // Add some randomness to temperatures
        highTemp: forecast.highTemp + Math.round((Math.random() - 0.5) * 4),
        lowTemp: forecast.lowTemp + Math.round((Math.random() - 0.5) * 3)
      }));

    if (locationForecasts.length === 0) {
      throw new Error("Forecast data not found for this location");
    }

    return locationForecasts;
  },

  // Get hourly forecast for a location
  async getHourlyForecast(locationId, hours = 24) {
    await delay(200);
    
    if (!locationId) {
      throw new Error("Location ID is required");
    }

    const locationHourlyForecasts = hourlyForecasts
      .filter(hf => hf.locationId === locationId)
      .slice(0, hours)
      .map((forecast, index) => ({
        ...forecast,
        // Adjust hour to be relative to current time
        hour: new Date(Date.now() + index * 60 * 60 * 1000).toISOString(),
        temperature: forecast.temperature + Math.round((Math.random() - 0.5) * 3)
      }));

    if (locationHourlyForecasts.length === 0) {
      throw new Error("Hourly forecast data not found for this location");
    }

    return locationHourlyForecasts;
  },

  // Get all weather data for a location (current + forecasts)
  async getLocationWeather(locationId) {
    await delay(400);
    
    try {
      const [current, forecast, hourly] = await Promise.all([
        this.getCurrentWeather(locationId),
        this.getForecast(locationId),
        this.getHourlyForecast(locationId)
      ]);

      return {
        current,
        forecast,
        hourly
      };
    } catch (error) {
      throw new Error(`Failed to fetch weather data: ${error.message}`);
    }
  }
};

export const locationService = {
  // Get all locations
  async getAll() {
    await delay(200);
    return [...locations];
  },

  // Search locations by name
  async search(query) {
    await delay(300);
    
    if (!query || query.trim().length < 2) {
      return [];
    }

    const searchQuery = query.toLowerCase().trim();
    return locations.filter(location =>
      location.name.toLowerCase().includes(searchQuery) ||
      location.country.toLowerCase().includes(searchQuery)
    );
  },

  // Get location by ID
  async getById(locationId) {
    await delay(200);
    
    const location = locations.find(l => l.id === locationId);
    if (!location) {
      throw new Error("Location not found");
    }
    
    return { ...location };
  },

  // Get saved locations
  async getSaved() {
    await delay(200);
    return locations.filter(l => l.isSaved);
  },

  // Get current location
  async getCurrent() {
    await delay(200);
    return locations.find(l => l.isCurrentLocation) || null;
  },

  // Save a location
  async save(locationId) {
    await delay(300);
    
    const locationIndex = locations.findIndex(l => l.id === locationId);
    if (locationIndex === -1) {
      throw new Error("Location not found");
    }

    locations[locationIndex] = { ...locations[locationIndex], isSaved: true };
    return { ...locations[locationIndex] };
  },

  // Remove a saved location
  async unsave(locationId) {
    await delay(300);
    
    const locationIndex = locations.findIndex(l => l.id === locationId);
    if (locationIndex === -1) {
      throw new Error("Location not found");
    }

    locations[locationIndex] = { ...locations[locationIndex], isSaved: false };
    return { ...locations[locationIndex] };
  },

  // Set current location
  async setCurrent(locationId) {
    await delay(300);
    
    // Remove current location flag from all locations
    locations = locations.map(l => ({ ...l, isCurrentLocation: false }));
    
    // Set new current location
    const locationIndex = locations.findIndex(l => l.id === locationId);
    if (locationIndex === -1) {
      throw new Error("Location not found");
    }

    locations[locationIndex] = { 
      ...locations[locationIndex], 
      isCurrentLocation: true,
      isSaved: true // Automatically save current location
    };
    
    return { ...locations[locationIndex] };
  }
};