import { useState, useEffect } from 'react';
import { useMeasurements } from '../../contexts/MeasurementsContext';
import { calculatePoolIA } from '../../utils/calculationHelpers';

export default function PoolCalculator() {
  const { map, pool, setPool } = useMeasurements();
  const [localValues, setLocalValues] = useState({
    perimeter: '',
    surfaceArea: '',
    depths: ['', '', '']
  });

  // Auto-populate from map measurements
  useEffect(() => {
    if (map.perimeter > 0 && map.surfaceArea > 0) {
      setLocalValues(prev => ({
        ...prev,
        perimeter: map.perimeter.toFixed(2),
        surfaceArea: map.surfaceArea.toFixed(2)
      }));
    }
  }, [map.perimeter, map.surfaceArea]);

  // Auto-calculate when all required fields are filled
  useEffect(() => {
    const perimeterNum = Number(localValues.perimeter);
    const surfaceAreaNum = Number(localValues.surfaceArea);
    const hasDepth = localValues.depths.some(d => d !== '' && Number(d) > 0);

    if (perimeterNum > 0 && surfaceAreaNum > 0 && hasDepth) {
      handleCalculate();
    }
  }, [localValues.perimeter, localValues.surfaceArea, localValues.depths]);

  const handleCalculate = () => {
    const { avgDepth, internalArea } = calculatePoolIA(
      localValues.perimeter,
      localValues.surfaceArea,
      localValues.depths
    );

    setPool({
      perimeter: Number(localValues.perimeter) || 0,
      surfaceArea: Number(localValues.surfaceArea) || 0,
      depths: localValues.depths,
      avgDepth,
      internalArea
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <h3 className="text-xl font-bold text-white">Pool Calculator</h3>
        <p className="text-blue-100 text-sm mt-1">Calculate Internal Area (IA) for pricing</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Map Measurements - Read Only Display */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span className="font-semibold text-blue-900">Map Measurements (Auto-filled)</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Perimeter (linear feet)
              </label>
              <input
                type="number"
                step="0.01"
                value={localValues.perimeter}
                onChange={(e) => setLocalValues({ ...localValues, perimeter: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold text-gray-900"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Surface Area (square feet)
              </label>
              <input
                type="number"
                step="0.01"
                value={localValues.surfaceArea}
                onChange={(e) => setLocalValues({ ...localValues, surfaceArea: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold text-gray-900"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        {/* Depth Inputs */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <span className="font-semibold text-amber-900">Pool Depths (Required)</span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Depth 1 (feet) *
              </label>
              <input
                type="number"
                step="0.01"
                value={localValues.depths[0]}
                onChange={(e) => {
                  const newDepths = [...localValues.depths];
                  newDepths[0] = e.target.value;
                  setLocalValues({ ...localValues, depths: newDepths });
                }}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg font-semibold text-gray-900"
                placeholder="6.0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Depth 2 (feet)
              </label>
              <input
                type="number"
                step="0.01"
                value={localValues.depths[1]}
                onChange={(e) => {
                  const newDepths = [...localValues.depths];
                  newDepths[1] = e.target.value;
                  setLocalValues({ ...localValues, depths: newDepths });
                }}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg font-semibold text-gray-900"
                placeholder="4.5"
              />
              <p className="text-xs text-gray-500 mt-1">Optional</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Depth 3 (feet)
              </label>
              <input
                type="number"
                step="0.01"
                value={localValues.depths[2]}
                onChange={(e) => {
                  const newDepths = [...localValues.depths];
                  newDepths[2] = e.target.value;
                  setLocalValues({ ...localValues, depths: newDepths });
                }}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg font-semibold text-gray-900"
                placeholder="3.0"
              />
              <p className="text-xs text-gray-500 mt-1">Optional</p>
            </div>
          </div>
        </div>

        {/* Results Display */}
        {pool.internalArea > 0 && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-bold text-green-900 text-lg">Calculation Results</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Surface Area</p>
                <p className="text-2xl font-bold text-gray-900">{pool.surfaceArea.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">sq ft</p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Perimeter</p>
                <p className="text-2xl font-bold text-gray-900">{pool.perimeter.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">linear ft</p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Average Depth</p>
                <p className="text-2xl font-bold text-gray-900">{pool.avgDepth.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">feet</p>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-4 shadow-md">
                <p className="text-sm text-green-100 mb-1">Internal Area (IA)</p>
                <p className="text-3xl font-bold text-white">{pool.internalArea.toFixed(2)}</p>
                <p className="text-xs text-green-100 mt-1">sq ft • Used for pricing</p>
              </div>
            </div>
          </div>
        )}

        {/* Manual Calculate Button (if auto-calc doesn't trigger) */}
        <button
          onClick={handleCalculate}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
        >
          Calculate Pool IA
        </button>
      </div>
    </div>
  );
}
