import { useState } from 'react';
import { useMeasurements } from '../../contexts/MeasurementsContext';
import { calculateSpaIA } from '../../utils/calculationHelpers';

export default function SpaCalculator() {
  const { spa, setSpa } = useMeasurements();
  const [localValues, setLocalValues] = useState({
    depth: '',
    diameter: '',
    circumference: ''
  });

  const handleCalculate = () => {
    const { diameter, circumference, surfaceArea, internalArea } = calculateSpaIA(
      localValues.depth,
      localValues.diameter,
      localValues.circumference
    );

    setSpa({
      depth: Number(localValues.depth) || 0,
      diameter,
      circumference,
      surfaceArea,
      internalArea
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
        <h3 className="text-xl font-bold text-white">Spa Calculator</h3>
        <p className="text-purple-100 text-sm mt-1">Optional - Calculate spa Internal Area (IA)</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Depth Input */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Spa Depth (feet) *
          </label>
          <input
            type="number"
            step="0.01"
            value={localValues.depth}
            onChange={(e) => setLocalValues({ ...localValues, depth: e.target.value })}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-semibold text-gray-900"
            placeholder="3.5"
          />
        </div>

        {/* Diameter Input */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Diameter (feet)
          </label>
          <input
            type="number"
            step="0.01"
            value={localValues.diameter}
            onChange={(e) => setLocalValues({ ...localValues, diameter: e.target.value, circumference: '' })}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg font-semibold text-gray-900"
            placeholder="6.0"
          />
        </div>

        {/* OR Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="text-gray-500 font-medium text-sm">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Circumference Input */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Circumference (feet)
          </label>
          <input
            type="number"
            step="0.01"
            value={localValues.circumference}
            onChange={(e) => setLocalValues({ ...localValues, circumference: e.target.value, diameter: '' })}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg font-semibold text-gray-900"
            placeholder="18.85"
          />
          <p className="text-xs text-gray-500 mt-2">Enter either diameter OR circumference, not both</p>
        </div>

        {/* Calculate Button */}
        <button
          onClick={handleCalculate}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
        >
          Calculate Spa IA
        </button>

        {/* Results Display */}
        {spa.internalArea > 0 && (
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-300 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-bold text-purple-900 text-lg">Spa Results</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Surface Area</p>
                <p className="text-2xl font-bold text-gray-900">{spa.surfaceArea.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">sq ft</p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Depth</p>
                <p className="text-2xl font-bold text-gray-900">{spa.depth.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">feet</p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Diameter</p>
                <p className="text-2xl font-bold text-gray-900">{spa.diameter.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">feet</p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Circumference</p>
                <p className="text-2xl font-bold text-gray-900">{spa.circumference.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">feet</p>
              </div>

              <div className="col-span-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg p-4 shadow-md">
                <p className="text-sm text-purple-100 mb-1">Spa Internal Area (IA)</p>
                <p className="text-3xl font-bold text-white">{spa.internalArea.toFixed(2)}</p>
                <p className="text-xs text-purple-100 mt-1">sq ft • Used for spa pricing</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
