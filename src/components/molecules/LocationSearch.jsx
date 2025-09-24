import React, { useState, useEffect, useRef } from "react";
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
      try {
        const searchResults = await locationService.search(query);
        setResults(Array.isArray(searchResults) ? searchResults : []);
        setShowResults(true);
      } catch (error) {
        console.error("Search failed:", error);
        
        // Provide specific error feedback
        let errorMessage = "Search failed. Please try again.";
        if (error.message?.includes('JSON')) {
          errorMessage = "Server response error. Please try again in a moment.";
        } else if (error.message?.includes('Failed to fetch')) {
          errorMessage = "Network error. Check your connection and try again.";
        }
        
        // You could show this error to user via toast notification
        // toast.error(errorMessage);
        
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