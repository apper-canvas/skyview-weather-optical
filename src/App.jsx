import React, { createContext, useContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import WeatherDashboard from "@/components/pages/WeatherDashboard";

// ApperClient Context
const ApperClientContext = createContext(null);

export const useApperClient = () => {
  const context = useContext(ApperClientContext);
  if (!context) {
    throw new Error('useApperClient must be used within ApperClientProvider');
  }
  return context;
};

function App() {
  const [apperClient, setApperClient] = useState(null);

  useEffect(() => {
    // Initialize ApperClient when SDK is ready
    if (window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      const client = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      setApperClient(client);
    }
  }, []);

  if (!apperClient) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <ApperClientContext.Provider value={apperClient}>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<WeatherDashboard />} />
          </Routes>
          
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            style={{ zIndex: 9999 }}
          />
        </div>
      </BrowserRouter>
    </ApperClientContext.Provider>
  );
}

export default App;