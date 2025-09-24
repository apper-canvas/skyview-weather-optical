import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-xl">
          {/* Error Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="CloudOff" size={40} className="text-white" />
          </div>

          {/* Error Message */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Weather Unavailable
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            {message || "We couldn't fetch the weather data. Please check your connection and try again."}
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            {onRetry && (
              <button
                onClick={onRetry}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <ApperIcon name="RefreshCw" size={18} />
                Try Again
              </button>
            )}

            <button
              onClick={() => window.location.reload()}
              className="w-full bg-white/80 text-gray-700 font-medium py-3 px-6 rounded-xl border border-gray-200 hover:bg-white transition-all duration-200 flex items-center justify-center gap-2"
            >
              <ApperIcon name="RotateCcw" size={18} />
              Refresh Page
            </button>
          </div>

          {/* Additional Help */}
<div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Make sure you have an internet connection and try refreshing the page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error;