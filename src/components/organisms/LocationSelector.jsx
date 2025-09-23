import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import LocationSearch from "@/components/molecules/LocationSearch";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";
import { locationService } from "@/services/api/weatherService";
import { toast } from "react-toastify";

const LocationSelector = ({ 
  currentLocation, 
  onLocationChange, 
  className 
}) => {
  const [savedLocations, setSavedLocations] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSavedLocations();
  }, []);

  const loadSavedLocations = async () => {
    try {
      const locations = await locationService.getSaved();
      setSavedLocations(locations);
    } catch (error) {
      console.error("Failed to load saved locations:", error);
    }
  };

  const handleLocationSelect = async (location) => {
    setLoading(true);
    try {
      // Set as current location
      await locationService.setCurrent(location.id);
      
      // Refresh saved locations
      await loadSavedLocations();
      
      // Notify parent component
      onLocationChange(location);
      
      // Close search
      setShowSearch(false);
      
      toast.success(`Weather updated for ${location.name}`);
    } catch (error) {
      console.error("Failed to select location:", error);
      toast.error("Failed to update location");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveLocation = async (locationId, event) => {
    event.stopPropagation();
    
    try {
      await locationService.unsave(locationId);
      await loadSavedLocations();
      toast.success("Location removed from favorites");
    } catch (error) {
      console.error("Failed to remove location:", error);
      toast.error("Failed to remove location");
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Current Location Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ApperIcon name="Navigation" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-gray-900">
            Weather Location
          </h2>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSearch(!showSearch)}
          className="text-primary"
        >
          <ApperIcon name={showSearch ? "X" : "Search"} size={16} />
        </Button>
      </div>

      {/* Search Section */}
      {showSearch && (
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/20">
          <LocationSearch
            onLocationSelect={handleLocationSelect}
            placeholder="Search for a city to add..."
          />
        </div>
      )}

      {/* Current Location Display */}
      {currentLocation && (
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-md rounded-2xl p-4 border border-primary/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
              <ApperIcon name="MapPin" size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900">
                {currentLocation.name}
              </div>
              <div className="text-sm text-gray-600">
                {currentLocation.country} • Current Location
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Saved Locations */}
      {savedLocations.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide">
            Saved Locations
          </h3>
          <div className="space-y-2">
            {savedLocations.map((location) => (
              <div
                key={location.id}
                className={cn(
                  "bg-white/70 backdrop-blur-md rounded-xl p-3 border border-white/20 transition-all duration-200 cursor-pointer hover:bg-white/80 hover:shadow-md group",
                  location.isCurrentLocation && "ring-2 ring-primary/30 bg-primary/5"
                )}
                onClick={() => handleLocationSelect(location)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      location.isCurrentLocation 
                        ? "bg-gradient-to-r from-primary to-secondary text-white" 
                        : "bg-gray-200 text-gray-600 group-hover:bg-gray-300"
                    )}>
                      <ApperIcon 
                        name={location.isCurrentLocation ? "Navigation" : "MapPin"} 
                        size={14} 
                      />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        {location.name}
                      </div>
                      <div className="text-xs text-gray-600">
                        {location.country}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {location.isCurrentLocation && (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full font-medium">
                        Active
                      </span>
                    )}
                    {!location.isCurrentLocation && (
                      <button
                        onClick={(e) => handleRemoveLocation(location.id, e)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-red-500 p-1"
                      >
                        <ApperIcon name="X" size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;