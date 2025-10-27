import { useState, useEffect } from 'react';
import { useMeasurements } from '../../contexts/MeasurementsContext';
import { calculatePrice } from '../../utils/pricingHelpers';

export default function PricingItem({ item, onPriceChange, onItemChange }) {
  const { pool, spa } = useMeasurements();
  const [selected, setSelected] = useState(false);
  const [measurement, setMeasurement] = useState('');
  const [tier, setTier] = useState(null);
  const [customBid, setCustomBid] = useState('');
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  // Auto-populate measurements based on item type
  useEffect(() => {
    if (selected && item.requires_measurement && !measurement) {
      // Auto-fill based on measurement type
      if (item.unit === 'sq_ft' && pool.internalArea > 0) {
        setMeasurement(pool.internalArea.toFixed(2));
      } else if (item.unit === 'linear_ft' && pool.perimeter > 0) {
        setMeasurement(pool.perimeter.toFixed(2));
      }
    }
  }, [selected, item, pool, spa]);

  const handleSelectionChange = (checked) => {
    setSelected(checked);
    if (!checked) {
      onPriceChange(item.id, 0);
      onItemChange(item.id, null);
      setMeasurement('');
      setTier(null);
      setCustomBid('');
      setCalculatedPrice(0);
    } else {
      updatePrice(measurement, tier, customBid);
    }
  };

  const updatePrice = (newMeasurement, newTier, newCustomBid) => {
    if (selected) {
      const price = calculatePrice(item, newMeasurement, newTier, newCustomBid);
      setCalculatedPrice(price);
      onPriceChange(item.id, price);
    }
  };

  // Update parent with item data whenever relevant state changes
  useEffect(() => {
    if (selected) {
      const selectedTier = tier && item.tiers
        ? item.tiers.find(t => t.tier === tier)
        : null;

      onItemChange(item.id, {
        id: item.id,
        name: item.name,
        description: item.description,
        measurement: measurement || null,
        unit: item.unit,
        tier: tier,
        tierName: selectedTier ? selectedTier.name : null,
        rate: selectedTier ? selectedTier.rate : item.rate
      });
    }
  }, [selected, measurement, tier, customBid]);

  const handleMeasurementChange = (value) => {
    setMeasurement(value);
    updatePrice(value, tier, customBid);
  };

  const handleTierChange = (value) => {
    const tierNum = Number(value);
    setTier(tierNum);
    updatePrice(measurement, tierNum, customBid);
  };

  const handleCustomBidChange = (value) => {
    setCustomBid(value);
    updatePrice(measurement, tier, value);
  };

  return (
    <div className={`border rounded-lg transition-all ${
      selected
        ? 'border-blue-400 bg-blue-50 shadow-md'
        : 'border-gray-200 bg-white hover:border-gray-300'
    }`}>
      <div className="p-4">
        {/* Checkbox and Item Name */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => handleSelectionChange(e.target.checked)}
            className="w-5 h-5 mt-1 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <label
                  className="font-semibold text-gray-900 cursor-pointer text-base"
                  onClick={() => handleSelectionChange(!selected)}
                >
                  {item.name}
                </label>
                {item.description && (
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                )}
              </div>
              {selected && calculatedPrice > 0 && (
                <div className="text-right ml-4">
                  <p className="text-2xl font-bold text-green-600">
                    ${calculatedPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              )}
            </div>

            {/* Expanded Options when Selected */}
            {selected && (
              <div className="mt-4 space-y-3 pl-0">
                {/* Tier Selection */}
                {item.pricing_type === 'per_unit_tiered' && (
                  <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Tier
                    </label>
                    <select
                      value={tier || ''}
                      onChange={(e) => handleTierChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    >
                      <option value="">Choose tier...</option>
                      {item.tiers.map((t) => (
                        <option key={t.tier} value={t.tier}>
                          {t.name} - ${t.rate}/{item.unit}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Measurement Input */}
                {item.requires_measurement && (
                  <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {item.measurement_label || 'Measurement'}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        value={measurement}
                        onChange={(e) => handleMeasurementChange(e.target.value)}
                        placeholder={`Enter ${item.unit || 'value'}`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-lg font-semibold"
                      />
                      {item.unit && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                          {item.unit.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                    {(item.unit === 'sq_ft' || item.unit === 'linear_ft') && (
                      <p className="text-xs text-blue-600 mt-1">
                        ✓ Auto-filled from calculator
                      </p>
                    )}
                  </div>
                )}

                {/* Custom Bid Input */}
                {item.pricing_type === 'custom_bid' && (
                  <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bid Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg">$</span>
                      <input
                        type="number"
                        step="0.01"
                        value={customBid}
                        onChange={(e) => handleCustomBidChange(e.target.value)}
                        placeholder="Enter custom bid amount"
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-lg font-semibold"
                      />
                    </div>
                  </div>
                )}

                {/* Flat Price Display */}
                {item.pricing_type === 'flat' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-gray-700">
                      Flat Price: <span className="font-bold text-green-700 text-lg">${item.price.toFixed(2)}</span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
