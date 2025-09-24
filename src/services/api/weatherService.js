// Delay utility for simulating network calls
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Initialize ApperClient instance
const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

// Initialize function for compatibility
export const initializeApperClient = () => {
  return Promise.resolve(apperClient);
};


// Current location storage
let currentUserLocation = null;
let savedLocations = [];
export const weatherService = {
  // Get current weather for location
  async getCurrentWeather(location = null) {
    const targetLocation = location || currentUserLocation;
    if (!targetLocation) {
      throw new Error("No current location set");
    }

    if (!apperClient) {
      throw new Error("ApperClient not initialized");
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

// Safe JSON parsing with validation
      let response;
      try {
        // Check if response has content
        const contentLength = result.headers.get('content-length');
        const contentType = result.headers.get('content-type');
        
        if (contentLength === '0' || !contentType?.includes('application/json')) {
          throw new Error(`Invalid response: ${result.status} ${result.statusText}`);
        }
        
        const text = await result.text();
        if (!text.trim()) {
          throw new Error('Empty response body');
        }
        
        response = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parsing error:', jsonError);
        throw new Error(`Failed to parse weather data: ${jsonError.message}`);
      }
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch weather data');
      }

      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch current weather: ${error.message}`);
    }
  },

  // Get 7-day forecast for location
  async getForecast(days = 7, location = null) {
    const targetLocation = location || currentUserLocation;
    if (!targetLocation) {
      throw new Error("No current location set");
    }

    if (!apperClient) {
      throw new Error("ApperClient not initialized");
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

// Safe JSON parsing with validation
      let response;
      try {
        // Check if response has content
        const contentLength = result.headers.get('content-length');
        const contentType = result.headers.get('content-type');
        
        if (contentLength === '0' || !contentType?.includes('application/json')) {
          throw new Error(`Invalid response: ${result.status} ${result.statusText}`);
        }
        
        const text = await result.text();
        if (!text.trim()) {
          throw new Error('Empty response body');
        }
        
        response = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parsing error:', jsonError);
        throw new Error(`Failed to parse forecast data: ${jsonError.message}`);
      }
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch forecast data');
      }

      return response.data.forecast.slice(0, days);
    } catch (error) {
      throw new Error(`Failed to fetch forecast: ${error.message}`);
    }
  },

  // Get hourly forecast for location
  async getHourlyForecast(hours = 24, location = null) {
    const targetLocation = location || currentUserLocation;
    if (!targetLocation) {
      throw new Error("No current location set");
    }

    if (!apperClient) {
      throw new Error("ApperClient not initialized");
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

// Safe JSON parsing with validation
      let response;
      try {
        // Check if response has content
        const contentLength = result.headers.get('content-length');
        const contentType = result.headers.get('content-type');
        
        if (contentLength === '0' || !contentType?.includes('application/json')) {
          throw new Error(`Invalid response: ${result.status} ${result.statusText}`);
        }
        
        const text = await result.text();
        if (!text.trim()) {
          throw new Error('Empty response body');
        }
        
        response = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parsing error:', jsonError);
        throw new Error(`Failed to parse hourly forecast data: ${jsonError.message}`);
      }
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch hourly data');
      }

      return response.data.hourly.slice(0, hours);
    } catch (error) {
      throw new Error(`Failed to fetch hourly forecast: ${error.message}`);
    }
  },

  // Get all weather data for location (accepts both location object and locationId)
  async getLocationWeather(locationOrId = null) {
    let targetLocation;
    
    if (typeof locationOrId === 'object' && locationOrId !== null) {
      // It's a location object
      targetLocation = locationOrId;
    } else if (typeof locationOrId === 'string' || typeof locationOrId === 'number') {
      // It's a location ID, find the location object
      if (currentUserLocation && currentUserLocation.id === locationOrId) {
        targetLocation = currentUserLocation;
      } else {
        // Try to find in saved locations
        targetLocation = savedLocations.find(loc => loc.id === locationOrId);
        if (!targetLocation) {
          throw new Error("Location not found");
        }
      }
    } else {
      // Use current location
      targetLocation = currentUserLocation;
    }

    if (!targetLocation) {
      throw new Error("No location specified");
    }

    if (!apperClient) {
      throw new Error("ApperClient not initialized");
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

// Safe JSON parsing with validation
      let response;
      try {
        // Check if response has content
        const contentLength = result.headers.get('content-length');
        const contentType = result.headers.get('content-type');
        
        if (contentLength === '0' || !contentType?.includes('application/json')) {
          throw new Error(`Invalid response: ${result.status} ${result.statusText}`);
        }
        
        const text = await result.text();
        if (!text.trim()) {
          throw new Error('Empty response body');
        }
        
        response = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parsing error:', jsonError);
        throw new Error(`Failed to parse historical data: ${jsonError.message}`);
      }
      
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
    currentUserLocation = { ...location, isCurrentLocation: true };
  },

  getCurrentLocation() {
    return currentUserLocation ? { ...currentUserLocation } : null;
  }
};

export const locationService = {
  // Search locations by name
  async search(query) {
    if (!query || query.trim().length < 2) {
      return [];
    }

    if (!apperClient) {
      throw new Error("ApperClient not initialized");
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

      // Validate response structure
      if (!result) {
        throw new Error('No response from server');
      }

      // Parse response if it's a string
      const response = typeof result === 'string' ? JSON.parse(result) : result;
      
      // Check for API success flag
      if (!response.success) {
        throw new Error(response.error || 'Search request failed');
      }

// Safe JSON parsing with validation
      let response;
      try {
        // Check if response has content
        const contentLength = result.headers.get('content-length');
        const contentType = result.headers.get('content-type');
        
        if (contentLength === '0' || !contentType?.includes('application/json')) {
          // Return empty array for search results when no content
          return [];
        }
        
        const text = await result.text();
        if (!text.trim()) {
          return [];
        }
        
        response = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parsing error in search:', jsonError);
        // For search, return empty array instead of throwing
        return [];
      }
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to search locations');
      }

// Return the data from successful response
      return response.data || [];
    } catch (error) {
      console.error('Location search error:', error);
      
      // Enhanced error message with more context
      let errorMessage = 'Failed to search locations';
      
      if (error.message?.includes('No response from server')) {
        errorMessage = 'Server connection failed. Please try again.';
      } else if (error.message?.includes('Search request failed')) {
        errorMessage = error.message;
      } else if (error.message?.includes('JSON')) {
        errorMessage = 'Server response error. Please try again later.';
      } else if (error.message) {
        errorMessage += `: ${error.message}`;
      }
      
      throw new Error(errorMessage);
    }
  },

  // Get all saved locations
async getSaved() {
    await delay(200);
    return [...savedLocations];
  },

  // Get current location (selected city)
  async getCurrent() {
    if (!currentUserLocation) {
      return null;
    }
    return { ...currentUserLocation };
  },

  // Save a searched location to history
  async save(location) {
    await delay(200);
    const existingIndex = savedLocations.findIndex(l => l.id === location.id);
    
    if (existingIndex === -1) {
      // Add to beginning of list (most recent first)
      savedLocations.unshift({ ...location, isSaved: true });
      
      // Keep only last 10 searches to avoid clutter
      if (savedLocations.length > 10) {
        savedLocations = savedLocations.slice(0, 10);
      }
    } else {
      // Move to front if already exists
      savedLocations.splice(existingIndex, 1);
      savedLocations.unshift({ ...location, isSaved: true });
    }
    
    return { ...location, isSaved: true };
  },

  // Remove a location from search history
  async unsave(locationId) {
    await delay(200);
    savedLocations = savedLocations.filter(l => l.id !== locationId);
    return true;
  },

  // Set current selected city
  async setCurrent(location) {
    await delay(200);
    
    // Handle both location objects and IDs
    let locationToSet;
    if (typeof location === 'object' && location.id) {
      locationToSet = location;
    } else {
      // If passed an ID, find the location in saved locations or current
      if (currentUserLocation && currentUserLocation.id === location) {
        locationToSet = currentUserLocation;
      } else {
        locationToSet = savedLocations.find(loc => loc.id === location);
        if (!locationToSet) {
          throw new Error('City not found in search history');
        }
      }
    }
    
    currentUserLocation = { 
      ...locationToSet, 
      isCurrentLocation: true,
      isSaved: true 
    };
    
    // Also save to search history
    await this.save(currentUserLocation);
    
    return { ...currentUserLocation };
  }
};