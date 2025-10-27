import { useState, useEffect } from 'react';
import PricingItem from './PricingItem';
import pricingDataJson from '@/data/measurements.json';

export default function PricingTool({ onGenerateQuote }) {
  const pricingData = pricingDataJson;
  const [prices, setPrices] = useState({});
  const [selectedItems, setSelectedItems] = useState({});
  const [total, setTotal] = useState(0);

  const handlePriceChange = (itemId, price) => {
    setPrices(prev => ({
      ...prev,
      [itemId]: price
    }));
  };

  const handleItemChange = (itemId, itemData) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: itemData
    }));
  };

  useEffect(() => {
    const sum = Object.values(prices).reduce((acc, price) => acc + price, 0);
    setTotal(sum);
  }, [prices]);

  const handleGenerateQuotes = () => {
    // Filter only selected items (those with a price > 0)
    const exportItems = Object.entries(selectedItems)
      .filter(([id, data]) => data && prices[id] > 0)
      .map(([id, data]) => ({
        ...data,
        price: prices[id]
      }));

    // Call parent component's callback with the selected services
    if (onGenerateQuote) {
      onGenerateQuote(exportItems);
    }
  };

  // Filter only selected items (those with a price > 0)
  const exportItems = Object.entries(selectedItems)
    .filter(([id, data]) => data && prices[id] > 0)
    .map(([id, data]) => ({
      ...data,
      price: prices[id]
    }));

  // Group categories by page for better organization
  const pageGroups = pricingData.categories.reduce((acc, category) => {
    const page = category.page || 1;
    if (!acc[page]) acc[page] = [];
    acc[page].push(category);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Summary Card at Top */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl shadow-xl p-6 sticky top-20 z-30">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">Quote Total</h3>
            <p className="text-slate-300 text-sm">{exportItems.length} service{exportItems.length !== 1 ? 's' : ''} selected</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-emerald-400">${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <button
              onClick={handleGenerateQuotes}
              disabled={exportItems.length === 0}
              className="mt-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded-lg transition-colors shadow-md"
            >
              Generate Quote
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Categories */}
      {Object.keys(pageGroups).sort().map(pageNum => (
        <div key={pageNum} className="space-y-4">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 rounded-lg">
            <h2 className="text-xl font-bold text-white">Page {pageNum}</h2>
          </div>

          {pageGroups[pageNum].map((category) => (
            <div key={category.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Category Header */}
              <div className="bg-gradient-to-r from-gray-100 to-gray-50 border-b border-gray-200 px-6 py-4">
                <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
              </div>

              {/* Category Items */}
              <div className="p-6 space-y-4">
                {category.items.map((item) => (
                  <PricingItem
                    key={item.id}
                    item={item}
                    onPriceChange={handlePriceChange}
                    onItemChange={handleItemChange}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Bottom Summary for Mobile */}
      <div className="lg:hidden bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl shadow-xl p-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-2">Quote Total</h3>
          <p className="text-4xl font-bold text-emerald-400 mb-4">${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p className="text-slate-300 text-sm mb-4">{exportItems.length} service{exportItems.length !== 1 ? 's' : ''} selected</p>
          <button
            onClick={handleGenerateQuotes}
            disabled={exportItems.length === 0}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md"
          >
            Generate Quote
          </button>
        </div>
      </div>
    </div>
  );
}
