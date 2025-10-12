# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pool measurement web application built with Astro, React, TypeScript, and Tailwind CSS. Users can search for addresses, draw pool outlines on satellite imagery, and get measurements (perimeter and area). The application uses Leaflet for mapping, Geoman for drawing, and proj4 for coordinate transformations.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (localhost:4321)
npm run dev
# or
npm start

# Build production site
npm run build

# Type check
astro check

# Preview production build locally
npm run preview
```

## Architecture

### Tech Stack
- **Framework**: Astro 4.15+ (static site generation)
- **UI Library**: React 18+ (islands architecture)
- **Styling**: Tailwind CSS with custom shadcn/ui components
- **Mapping**: Leaflet + Geoman (drawing tools) + Esri satellite imagery
- **Coordinate System**: UTM Zone 11N (EPSG:32611) for accurate measurements
- **Forms**: React Hook Form + Zod validation
- **Notifications**: Sonner (toast notifications)

### Project Structure
- `src/pages/` - Astro page routes
  - `index.astro` - Landing page
  - `measure.astro` - Full-screen map measurement tool
- `src/components/` - React components
  - `MapContainer.tsx` - Main map component with drawing, measurement logic
  - `ui/` - Reusable shadcn/ui components (button, dialog, form, etc.)
- `src/layouts/` - Astro layout templates
- `src/styles/global.css` - Global styles and CSS variables
- `astro.config.mjs` - Astro configuration (React + Tailwind integrations)
- `tsconfig.json` - TypeScript config with path aliases (`@/*` maps to `src/*`)
- `tailwind.config.mjs` - Tailwind theme with CSS variables for colors

### Key Technical Details

**Coordinate Transformations**
- User draws polygons in WGS84 (lat/lng) on Leaflet map
- Measurements require UTM Zone 11N (EPSG:32611) projection for meter-based calculations
- Use proj4 library to transform: `proj4("EPSG:4326", "EPSG:32611", [lng, lat])`
- Perimeter calculated as sum of edge distances in UTM coordinates
- Area calculated using shoelace formula in UTM coordinates
- Results displayed in both metric (m, m²) and imperial (ft, ft²) units

**Leaflet + Geoman Integration**
- Map initialization uses Esri World Imagery tiles (max zoom: 22)
- Geoman drawing configured with snapping, double-click to finish
- Polygon editing enabled after creation (drag vertices)
- Event listeners: `pm:create`, `pm:edit`, `pm:remove`
- Measurements recalculated on every vertex edit

**React in Astro**
- Use `client:only="react"` directive for components that need client-side rendering
- MapContainer must be client-only due to Leaflet DOM requirements
- shadcn/ui components work with Astro's islands architecture

**Geocoding**
- Uses Nominatim (OpenStreetMap) API - free, no API key required
- Limited to US addresses (`countrycodes: "us"`)
- Requires User-Agent header: `PoolMeasurementApp/1.0`

**Styling System**
- Tailwind with CSS variables defined in `src/styles/global.css`
- Color tokens: `--primary`, `--secondary`, `--accent`, `--border`, etc.
- Dark mode support via `class` strategy (not currently active)
- shadcn/ui components use HSL color values with CSS variables

## Important Implementation Notes

1. **Leaflet Icon Fix**: Always include the Leaflet icon URL workaround in MapContainer to prevent missing marker icons in Vite builds.

2. **Z-index Layers**: Map controls use z-index 1002-1003 to stay above Leaflet layers (1000-1001).

3. **Form Validation**: All forms use Zod schemas with react-hook-form for type-safe validation.

4. **Client-Side Only**: MapContainer and all Leaflet-dependent code must use `client:only="react"` to avoid SSR issues.

5. **Measurement Accuracy**: UTM Zone 11N is specific to San Diego County region. If expanding to other areas, adjust the EPSG code based on location.

## Path Aliases

TypeScript and Astro configured with `@/*` alias pointing to `src/*`:
```typescript
import { Button } from "@/components/ui/button"
```

## Future Development

The codebase includes TODO comments for Phase 5 backend integration (form submission endpoint). Currently, form submissions are logged to console with simulated async behavior.
