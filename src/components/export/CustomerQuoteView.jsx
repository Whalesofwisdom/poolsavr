export default function CustomerQuoteView({ selectedItems, total }) {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="customer-quote-view">
      <div className="quote-header">
        <h1>Pool Remodel Quote</h1>
        <p className="date">Date: {today}</p>
      </div>

      <div className="quote-intro">
        <p>Thank you for considering our pool remodeling services. Below is a detailed quote for your project.</p>
      </div>

      <div className="quote-items">
        {selectedItems.length === 0 ? (
          <p className="no-items">No items selected</p>
        ) : (
          <ul className="items-list">
            {selectedItems.map((item) => (
              <li key={item.id} className="quote-item">
                <div className="item-content">
                  <span className="item-name">{item.name}</span>
                  {item.description && (
                    <span className="item-description"> - {item.description}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedItems.length > 0 && (
        <div className="quote-total">
          <h2>Total Investment: ${total.toFixed(2)}</h2>
        </div>
      )}

      <div className="quote-footer">
        <p>This quote is valid for 30 days from the date above.</p>
        <p>We look forward to working with you!</p>
      </div>

      <style jsx>{`
        .customer-quote-view {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          padding: 40px;
          font-family: 'Georgia', serif;
        }

        .quote-header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 3px solid #007bff;
        }

        .quote-header h1 {
          margin: 0 0 10px 0;
          font-size: 36px;
          color: #007bff;
          font-weight: 400;
        }

        .date {
          color: #666;
          font-size: 14px;
          font-style: italic;
        }

        .quote-intro {
          margin-bottom: 30px;
          text-align: center;
        }

        .quote-intro p {
          font-size: 16px;
          color: #555;
          line-height: 1.6;
        }

        .no-items {
          text-align: center;
          padding: 40px;
          color: #999;
          font-size: 18px;
        }

        .items-list {
          list-style: none;
          padding: 0;
          margin: 0 0 40px 0;
        }

        .quote-item {
          padding: 15px 20px;
          margin-bottom: 10px;
          background: #f8f9fa;
          border-left: 4px solid #007bff;
          page-break-inside: avoid;
        }

        .item-content {
          display: block;
        }

        .item-name {
          font-weight: 600;
          color: #333;
          font-size: 16px;
        }

        .item-description {
          color: #666;
          font-size: 14px;
          font-style: italic;
        }

        .quote-total {
          margin: 40px 0;
          padding: 30px;
          background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
          color: white;
          text-align: center;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .quote-total h2 {
          margin: 0;
          font-size: 32px;
          font-weight: 400;
        }

        .quote-footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #ddd;
        }

        .quote-footer p {
          color: #666;
          font-size: 14px;
          margin: 5px 0;
          font-style: italic;
        }

        @media print {
          .customer-quote-view {
            padding: 20px;
          }

          .quote-item {
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}
