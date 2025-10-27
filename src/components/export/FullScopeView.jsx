export default function FullScopeView({ selectedItems, total }) {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="full-scope-view">
      <div className="scope-header">
        <h1>Pool Remodel - Scope of Work</h1>
        <p className="date">Date: {today}</p>
      </div>

      <div className="scope-items">
        {selectedItems.length === 0 ? (
          <p className="no-items">No items selected</p>
        ) : (
          selectedItems.map((item) => (
            <div key={item.id} className="scope-item">
              <div className="item-name-section">
                <h3>{item.name}</h3>
                {item.description && (
                  <p className="item-description">{item.description}</p>
                )}
              </div>

              <div className="item-details">
                {item.measurement && (
                  <div className="detail-row">
                    <span className="label">Measurement:</span>
                    <span className="value">
                      {item.measurement} {item.unit || ''}
                    </span>
                  </div>
                )}

                {item.tier && (
                  <div className="detail-row">
                    <span className="label">Tier Selected:</span>
                    <span className="value">{item.tierName}</span>
                  </div>
                )}

                {item.rate && (
                  <div className="detail-row">
                    <span className="label">Unit Cost:</span>
                    <span className="value">
                      ${item.rate.toFixed(2)}/{item.unit || 'unit'}
                    </span>
                  </div>
                )}

                <div className="detail-row price-row">
                  <span className="label">Line Total:</span>
                  <span className="value price">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedItems.length > 0 && (
        <div className="scope-total">
          <h2>Total Project Cost: ${total.toFixed(2)}</h2>
        </div>
      )}

      <style jsx>{`
        .full-scope-view {
          max-width: 900px;
          margin: 0 auto;
          background: white;
          padding: 40px;
        }

        .scope-header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 3px solid #333;
        }

        .scope-header h1 {
          margin: 0 0 10px 0;
          font-size: 32px;
          color: #333;
        }

        .date {
          color: #666;
          font-size: 14px;
        }

        .no-items {
          text-align: center;
          padding: 40px;
          color: #999;
          font-size: 18px;
        }

        .scope-item {
          margin-bottom: 30px;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          page-break-inside: avoid;
        }

        .item-name-section h3 {
          margin: 0 0 10px 0;
          font-size: 20px;
          color: #007bff;
        }

        .item-description {
          margin: 0 0 15px 0;
          color: #666;
          font-style: italic;
          font-size: 14px;
        }

        .item-details {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 4px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #dee2e6;
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .detail-row .label {
          font-weight: 600;
          color: #555;
        }

        .detail-row .value {
          color: #333;
        }

        .price-row {
          margin-top: 10px;
          padding-top: 15px;
          border-top: 2px solid #007bff;
          font-size: 18px;
        }

        .price-row .value.price {
          color: #007bff;
          font-weight: bold;
        }

        .scope-total {
          margin-top: 40px;
          padding: 25px;
          background: #007bff;
          color: white;
          text-align: center;
          border-radius: 8px;
        }

        .scope-total h2 {
          margin: 0;
          font-size: 28px;
        }

        @media print {
          .full-scope-view {
            padding: 20px;
          }

          .scope-item {
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}
