import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-4 animate-pulse">
      {/* Header Skeleton */}
      <div className="max-w-lg mx-auto mb-8">
        <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mb-4"></div>
        <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl"></div>
      </div>

      {/* Current Weather Card Skeleton */}
      <div className="max-w-lg mx-auto mb-6">
        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-xl">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mx-auto mb-4"></div>
            <div className="h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mb-2"></div>
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-32 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <div className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mx-auto mb-2"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16 mx-auto mb-1"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-12 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hourly Forecast Skeleton */}
      <div className="max-w-lg mx-auto mb-6">
        <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32 mb-4"></div>
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 shadow-lg">
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex-shrink-0 text-center">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-12 mb-2"></div>
                <div className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mx-auto mb-2"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-8 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Forecast Skeleton */}
      <div className="max-w-lg mx-auto">
        <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32 mb-4"></div>
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 shadow-lg">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
                <div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16 mb-1"></div>
                  <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24"></div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-8"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-12"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;