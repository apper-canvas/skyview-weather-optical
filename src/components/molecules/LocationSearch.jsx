import React, { useState, useEffect, useRef } from "react";
import { toast } from 'react-toastify';
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";
import { locationService } from "@/services/api/weatherService";

const LocationSearch = ({ onLocationSelect, placeholder = "Search for a city..." }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchLocations = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        setShowResults(false);
        return;
      }

setIsLoading(true);
      setResults([]); // Clear previous results
      
      try {
        const searchResults = await locationService.search(query);
        
        // Validate response structure
        if (!searchResults) {
          throw new Error('No response received from location service');
        }
        
        const results = Array.isArray(searchResults) ? searchResults : [];
        setResults(results);
        setShowResults(true);
        
        // Show info if no results found for valid query
        if (results.length === 0 && query.trim().length >= 2) {
          toast.info(`No locations found for "${query}". Try a different search term.`);
        }
        
      } catch (error) {
        console.error("Location search failed:", error, {
          query,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        });
        
        // Enhanced error message extraction with 500 error handling
        let errorMessage = "Search failed. Please try again.";
        
        // Handle specific error patterns from enhanced edge function
        if (error.message?.includes('Service temporarily unavailable') || 
            error.message?.includes('temporarily unavailable')) {
          errorMessage = "Location search is temporarily unavailable. Please try again in a moment.";
        } else if (error.message?.includes('Request failed with status code 500') || 
                   error.message?.includes('status code 500')) {
          errorMessage = "Search service is experiencing issues. Please try again shortly.";
        } else if (error.message?.includes('Weather service authentication failed')) {
          errorMessage = "Search service configuration error. Please contact support.";
        } else if (error.message?.includes('Too many requests')) {
          errorMessage = "Too many search requests. Please wait a moment before searching again.";
        } else if (error.message?.includes('Invalid search query')) {
          errorMessage = "Please enter a valid city or location name.";
        } else if (error.message?.includes('Server connection failed') || 
                   error.message?.includes('Failed to fetch')) {
          errorMessage = "Unable to connect to search service. Please check your internet connection.";
        } else if (error.message?.includes('Network')) {
          errorMessage = "Network error. Check your connection and try again.";
        } else if (error.message?.includes('JSON') || error.message?.includes('Data format')) {
          errorMessage = "Data format error. Please try a different search term.";
        } else if (error.message?.includes('Failed to search locations')) {
          // Extract the specific error from the message
          const match = error.message.match(/Failed to search locations[:\s]*(.+)/i);
          errorMessage = match?.[1]?.trim() || "Location search service is unavailable. Please try again.";
        } else if (error.message && error.message.length > 5 && error.message.length < 100) {
          // Use the error message if it seems user-friendly (reasonable length)
          errorMessage = error.message;
        }
        
        // Show user-friendly error notification
        toast.error(errorMessage, {
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true
        });
        
        setResults([]);
        setShowResults(false);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(searchLocations, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleLocationSelect = (location) => {
    setQuery(location.name);
    setShowResults(false);
    onLocationSelect(location);
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <ApperIcon 
          name="Search" 
          size={18} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
        />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          className="pl-10 pr-10"
        />
        {isLoading && (
          <ApperIcon 
            name="Loader" 
            size={18} 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 animate-spin" 
          />
        )}
      </div>

      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 max-h-60 overflow-y-auto">
          {results.length > 0 ? (
            results.map((location) => (
<button
                key={location.id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleLocationSelect(location);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <div className="font-medium text-gray-900">{location.name}</div>
                  <div className="text-sm text-gray-500">{location.country}</div>
                </div>
                <div className="flex items-center gap-2">
                  {location.isSaved && (
                    <ApperIcon name="Star" size={14} className="text-yellow-500 fill-current" />
                  )}
                  <ApperIcon 
                    name="ChevronRight" 
                    size={16} 
                    className="text-gray-400 group-hover:text-gray-600 transition-colors duration-150" 
                  />
                </div>
              </button>
            ))
          ) : (
            <div className="px-4 py-8 text-center text-gray-500">
              <ApperIcon name="MapPin" size={24} className="mx-auto mb-2 text-gray-300" />
              <p>No locations found</p>
              <p className="text-sm mt-1">Try searching for a different city</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;