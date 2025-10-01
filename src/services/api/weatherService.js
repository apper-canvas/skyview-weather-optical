import locationsData from "@/services/mockData/locations.json";

// Initialize ApperClient
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Location data store
let locations = [...locationsData];

export const weatherService = {
  // Get current weather for a location
  async getCurrentWeather(locationId) {
    await delay(300);
    
    if (!locationId) {
      throw new Error("Location ID is required");
    }

    // Get location coordinates
    const location = locations.find(l => l.id === locationId);
    if (!location) {
      throw new Error("Location not found");
    }

try {
      const result = await apperClient.functions.invoke(import.meta.env.VITE_GET_WEATHER_DATA, {
        body: JSON.stringify({
          latitude: location.latitude,
          longitude: location.longitude
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const responseData = await result.json();
      
      if (responseData.success === false) {
        console.info(`apper_info: An error was received in this function: ${import.meta.env.VITE_GET_WEATHER_DATA}. The response status: ${result.status}. The response body is: ${JSON.stringify(responseData)}.`);
        throw new Error(responseData.error || "Failed to fetch weather data");
      }

      return responseData.data.current;
    } catch (error) {
      console.info(`apper_info: An error was received in this function: ${import.meta.env.VITE_GET_WEATHER_DATA}. The error is: ${error.message}`);
      throw new Error(`Failed to fetch current weather: ${error.message}`);
    }
  },

  // Get 7-day forecast for a location
  async getForecast(locationId, days = 7) {
    await delay(250);
    
    if (!locationId) {
      throw new Error("Location ID is required");
    }

    // Get location coordinates
    const location = locations.find(l => l.id === locationId);
    if (!location) {
      throw new Error("Location not found");
    }

try {
      const result = await apperClient.functions.invoke(import.meta.env.VITE_GET_WEATHER_DATA, {
        body: JSON.stringify({
          latitude: location.latitude,
          longitude: location.longitude
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const responseData = await result.json();
      
      if (responseData.success === false) {
        console.info(`apper_info: An error was received in this function: ${import.meta.env.VITE_GET_WEATHER_DATA}. The response status: ${result.status}. The response body is: ${JSON.stringify(responseData)}.`);
        throw new Error(responseData.error || "Failed to fetch forecast data");
      }

      return responseData.data.forecast.slice(0, days);
    } catch (error) {
      console.info(`apper_info: An error was received in this function: ${import.meta.env.VITE_GET_WEATHER_DATA}. The error is: ${error.message}`);
      throw new Error(`Failed to fetch forecast: ${error.message}`);
    }
  },

  // Get hourly forecast for a location
  async getHourlyForecast(locationId, hours = 24) {
    await delay(200);
    
    if (!locationId) {
      throw new Error("Location ID is required");
    }

    // Get location coordinates
    const location = locations.find(l => l.id === locationId);
    if (!location) {
      throw new Error("Location not found");
    }

try {
      const result = await apperClient.functions.invoke(import.meta.env.VITE_GET_WEATHER_DATA, {
        body: JSON.stringify({
          latitude: location.latitude,
          longitude: location.longitude
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const responseData = await result.json();
      
      if (responseData.success === false) {
        console.info(`apper_info: An error was received in this function: ${import.meta.env.VITE_GET_WEATHER_DATA}. The response status: ${result.status}. The response body is: ${JSON.stringify(responseData)}.`);
        throw new Error(responseData.error || "Failed to fetch hourly data");
      }

      return responseData.data.hourly.slice(0, Math.min(hours, 12));
    } catch (error) {
      console.info(`apper_info: An error was received in this function: ${import.meta.env.VITE_GET_WEATHER_DATA}. The error is: ${error.message}`);
      throw new Error(`Failed to fetch hourly forecast: ${error.message}`);
    }
  },

  // Get all weather data for a location (current + forecasts)
  async getLocationWeather(locationId) {
    await delay(400);
    
    if (!locationId) {
      throw new Error("Location ID is required");
    }

    // Get location coordinates
    const location = locations.find(l => l.id === locationId);
    if (!location) {
      throw new Error("Location not found");
    }

try {
      const result = await apperClient.functions.invoke(import.meta.env.VITE_GET_WEATHER_DATA, {
        body: JSON.stringify({
          latitude: location.latitude,
          longitude: location.longitude
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const responseData = await result.json();
      
      if (responseData.success === false) {
        console.info(`apper_info: An error was received in this function: ${import.meta.env.VITE_GET_WEATHER_DATA}. The response status: ${result.status}. The response body is: ${JSON.stringify(responseData)}.`);
        throw new Error(responseData.error || "Failed to fetch weather data");
      }

      return responseData.data;
    } catch (error) {
      console.info(`apper_info: An error was received in this function: ${import.meta.env.VITE_GET_WEATHER_DATA}. The error is: ${error.message}`);
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