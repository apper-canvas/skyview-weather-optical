// Initialize ApperClient for edge function communication
const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Current location storage
let currentUserLocation = null;
let savedLocations = [];

export const weatherService = {
  // Get current weather for current location
async getCurrentWeather(location = null) {
    const targetLocation = location || currentUserLocation;
    if (!targetLocation) {
      throw new Error("No current location set");
    }

    try {
      const url = `?action=current&lat=${targetLocation.lat}&lon=${targetLocation.lon}`;
      const result = await apperClient.functions.invoke(import.meta.env.VITE_WEATHER_API, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
      });

      const response = await result.json();
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch weather data');
      }

      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch current weather: ${error.message}`);
    }
  },

  // Get 7-day forecast for current location
async getForecast(days = 7, location = null) {
    const targetLocation = location || currentUserLocation;
    if (!targetLocation) {
      throw new Error("No current location set");
    }

    try {
      const url = `?action=forecast&lat=${targetLocation.lat}&lon=${targetLocation.lon}`;
      const result = await apperClient.functions.invoke(import.meta.env.VITE_WEATHER_API, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
      });

      const response = await result.json();
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch forecast data');
      }

      return response.data.forecast.slice(0, days);
    } catch (error) {
      throw new Error(`Failed to fetch forecast: ${error.message}`);
    }
  },

  // Get hourly forecast for current location
async getHourlyForecast(hours = 24, location = null) {
    const targetLocation = location || currentUserLocation;
    if (!targetLocation) {
      throw new Error("No current location set");
    }

    try {
      const url = `?action=forecast&lat=${targetLocation.lat}&lon=${targetLocation.lon}`;
      const result = await apperClient.functions.invoke(import.meta.env.VITE_WEATHER_API, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
      });

      const response = await result.json();
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch hourly data');
      }

      return response.data.hourly.slice(0, hours);
    } catch (error) {
      throw new Error(`Failed to fetch hourly forecast: ${error.message}`);
    }
  },

  // Get all weather data for current location
async getLocationWeather(location = null) {
    const targetLocation = location || currentUserLocation;
    if (!targetLocation) {
      throw new Error("No current location set");
    }

    try {
      const url = `?action=forecast&lat=${targetLocation.lat}&lon=${targetLocation.lon}`;
      const result = await apperClient.functions.invoke(import.meta.env.VITE_WEATHER_API, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
      });

      const response = await result.json();
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch weather data');
      }

      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch weather data: ${error.message}`);
    }
  },

  // Location management methods
  setCurrentLocation(location) {
    currentUserLocation = location;
  },

  getCurrentLocation() {
    return currentUserLocation;
  }
};

export const locationService = {
  // Get user's current geolocation
  async getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            id: 1,
            name: "Current Location",
            country: "Auto-detected",
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            isCurrentLocation: true,
            isSaved: true
          };
          currentUserLocation = location;
          resolve(location);
        },
        (error) => {
          let errorMessage = "Failed to get location";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access denied by user";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out";
              break;
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  },

  // Search locations by name
async search(query) {
    if (!query || query.trim().length < 2) {
      return [];
    }

    try {
      const url = `?action=search&query=${encodeURIComponent(query)}`;
      const result = await apperClient.functions.invoke(import.meta.env.VITE_WEATHER_API, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
      });

      const response = await result.json();
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to search locations');
      }

      return response.data;
    } catch (error) {
      throw new Error(`Failed to search locations: ${error.message}`);
    }
  },

  // Get all saved locations
  async getSaved() {
    await delay(200);
    return [...savedLocations];
  },

  // Get current location
  async getCurrent() {
    if (!currentUserLocation) {
      try {
        return await this.getCurrentPosition();
      } catch (error) {
        return null;
      }
    }
    return { ...currentUserLocation };
  },

  // Save a location
  async save(location) {
    await delay(200);
    const existingIndex = savedLocations.findIndex(l => l.id === location.id);
    
    if (existingIndex === -1) {
      savedLocations.push({ ...location, isSaved: true });
    } else {
      savedLocations[existingIndex] = { ...location, isSaved: true };
    }
    
    return { ...location, isSaved: true };
  },

  // Remove a saved location
  async unsave(locationId) {
    await delay(200);
    savedLocations = savedLocations.filter(l => l.id !== locationId);
    return true;
  },

  // Set current location
  async setCurrent(location) {
    await delay(200);
    currentUserLocation = { 
      ...location, 
      isCurrentLocation: true,
      isSaved: true 
    };
    
    // Also save to saved locations
    await this.save(currentUserLocation);
    
    return { ...currentUserLocation };
  }
};