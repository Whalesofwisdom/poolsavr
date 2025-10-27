import { createContext, useContext, useState } from 'react';

const MeasurementsContext = createContext();

export const MeasurementsProvider = ({ children }) => {
  // Stage 1: Map measurements (from poolsavr MapContainer)
  const [map, setMap] = useState({
    perimeter: 0,      // in feet
    surfaceArea: 0,    // in square feet
    address: ''
  });

  // Stage 2: Pool calculator measurements
  const [pool, setPool] = useState({
    perimeter: 0,
    surfaceArea: 0,
    depths: [],        // array of 1-3 depth values
    avgDepth: 0,
    internalArea: 0
  });

  // Stage 3: Spa calculator measurements
  const [spa, setSpa] = useState({
    depth: 0,
    diameter: 0,
    circumference: 0,
    surfaceArea: 0,
    internalArea: 0
  });

  // Helper functions to update each section
  const setMapMeasurements = (measurements) => {
    setMap(prev => ({ ...prev, ...measurements }));
  };

  const setPoolMeasurements = (measurements) => {
    setPool(prev => ({ ...prev, ...measurements }));
  };

  const setSpaMeasurements = (measurements) => {
    setSpa(prev => ({ ...prev, ...measurements }));
  };

  const value = {
    map,
    pool,
    spa,
    setMapMeasurements,
    setPoolMeasurements,
    setSpaMeasurements
  };

  return (
    <MeasurementsContext.Provider value={value}>
      {children}
    </MeasurementsContext.Provider>
  );
};

export const useMeasurements = () => {
  const context = useContext(MeasurementsContext);
  if (!context) {
    throw new Error('useMeasurements must be used within a MeasurementsProvider');
  }
  return context;
};