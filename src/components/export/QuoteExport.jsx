import { useState } from 'react';
import FullScopeView from './FullScopeView';
import CustomerQuoteView from './CustomerQuoteView';

export default function QuoteExport({ selectedItems, total }) {
  const [activeTab, setActiveTab] = useState('full');

  return (
    <div className="quote-export">
      <div className="export-tabs no-print">
        <button
          className={`tab-button ${activeTab === 'full' ? 'active' : ''}`}
          onClick={() => setActiveTab('full')}
        >
          Full Scope of Work
        </button>
        <button
          className={`tab-button ${activeTab === 'customer' ? 'active' : ''}`}
          onClick={() => setActiveTab('customer')}
        >
          Customer Quote
        </button>
        <button
          className="print-button"
          onClick={() => window.print()}
        >
          Print Current View
        </button>
      </div>

      <div className="export-content">
        {activeTab === 'full' ? (
          <FullScopeView selectedItems={selectedItems} total={total} />
        ) : (
          <CustomerQuoteView selectedItems={selectedItems} total={total} />
        )}
      </div>

      <style jsx>{`
        .quote-export {
          padding: 20px;
        }

        .export-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
          border-bottom: 2px solid #ddd;
          padding-bottom: 10px;
        }

        .tab-button {
          padding: 10px 20px;
          border: 1px solid #ddd;
          background: white;
          cursor: pointer;
          border-radius: 4px 4px 0 0;
          font-size: 16px;
          transition: all 0.2s;
        }

        .tab-button:hover {
          background: #f5f5f5;
        }

        .tab-button.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .print-button {
          margin-left: auto;
          padding: 10px 20px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          font-weight: bold;
        }

        .print-button:hover {
          background: #218838;
        }

        @media print {
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
