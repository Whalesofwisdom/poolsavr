// Calculate price based on pricing type
export function calculatePrice(item, measurement, tier = null, customBid = 0) {
  const measure = Number(measurement) || 0;

  switch (item.pricing_type) {
    case 'flat':
      return item.price;

    case 'per_unit':
      return item.rate * measure;

    case 'per_unit_tiered':
      if (!tier) return 0;
      const selectedTier = item.tiers.find(t => t.tier === tier);
      return selectedTier ? selectedTier.rate * measure : 0;

    case 'base_with_overage':
      if (measure <= item.base_threshold) {
        return item.base_price;
      }
      const overage = measure - item.base_threshold;
      return item.base_price + (overage * item.overage_rate);

    case 'per_unit_with_minimum':
      // For minimum quantity (e.g., 40 ft minimum)
      if (item.minimum_quantity) {
        const billable = Math.max(measure, item.minimum_quantity);
        return item.rate * billable;
      }
      // For minimum included (e.g., first 3 rust spots included)
      if (item.minimum_included) {
        const billable = Math.max(0, measure - item.minimum_included);
        return item.rate * billable;
      }
      return item.rate * measure;

    case 'base_with_electric':
      return item.base_price + (item.electric_rate * measure);

    case 'custom_bid':
      return Number(customBid) || 0;

    default:
      return 0;
  }
}
