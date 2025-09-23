import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No Weather Data", 
  description = "We couldn't find weather information for your location.",
  actionText = "Enable Location",
  onAction 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-xl">
          {/* Empty State Icon */}
          <div className="w-24 h-24 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="MapPin" size={48} className="text-white" />
          </div>

          {/* Empty State Content */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {title}
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            {description}
          </p>

          {/* Action Button */}
          {onAction && (
            <button
              onClick={onAction}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold py-4 px-6 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-3"
            >
              <ApperIcon name="Navigation" size={20} />
              {actionText}
            </button>
          )}

          {/* Alternative Actions */}
          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-4">Or try these options:</p>
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-white/80 text-gray-700 font-medium py-3 px-4 rounded-xl border border-gray-200 hover:bg-white transition-all duration-200 flex items-center justify-center gap-2">
                <ApperIcon name="Search" size={16} />
                Search City
              </button>
              <button className="bg-white/80 text-gray-700 font-medium py-3 px-4 rounded-xl border border-gray-200 hover:bg-white transition-all duration-200 flex items-center justify-center gap-2">
                <ApperIcon name="RefreshCw" size={16} />
                Refresh
              </button>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              SkyView needs your location to provide accurate weather forecasts. Your location data stays private and secure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Empty;