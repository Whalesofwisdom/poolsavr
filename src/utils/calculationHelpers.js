// Calculate average depth from array of numbers
export function calculateAverageDepth(depths) {
  const validNumbers = depths.filter(n => n !== '' && !isNaN(n)).map(Number);
  if (validNumbers.length === 0) return 0;

  // Sum all valid depths and divide by count
  const sum = validNumbers.reduce((acc, num) => acc + num, 0);
  return sum / validNumbers.length;
}

// Calculate pool internal area
export function calculatePoolIA(perimeter, surfaceArea, depths) {
  const perim = Number(perimeter) || 0;
  const surface = Number(surfaceArea) || 0;
  const avgDepth = calculateAverageDepth(depths);

  const internalArea = surface + (perim * avgDepth);

  return {
    avgDepth: Math.round(avgDepth * 100) / 100,
    internalArea: Math.round(internalArea * 100) / 100
  };
}

// Calculate spa internal area
export function calculateSpaIA(depth, diameter, circumference) {
  const d = Number(depth) || 0;
  let diam = Number(diameter) || 0;
  let circ = Number(circumference) || 0;

  // Calculate missing value
  if (diam && !circ) {
    circ = Math.PI * diam;
  } else if (circ && !diam) {
    diam = circ / Math.PI;
  }

  const radius = diam / 2;
  const surfaceArea = Math.PI * radius * radius;
  const internalArea = surfaceArea + (circ * d);

  return {
    diameter: Math.round(diam * 100) / 100,
    circumference: Math.round(circ * 100) / 100,
    surfaceArea: Math.round(surfaceArea * 100) / 100,
    internalArea: Math.round(internalArea * 100) / 100
  };
}
