import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import "@geoman-io/leaflet-geoman-free";
import proj4 from "proj4";
import { Search, Loader2, Pencil, Trash2, Undo, ArrowRight, Ruler, Maximize2, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { toast } from "sonner";

// Fix Leaflet default icon issue with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Define UTM Zone 11N projection (for San Diego County)
proj4.defs("EPSG:32611", "+proj=utm +zone=11 +datum=WGS84 +units=m +no_defs");

interface GeocodingResult {
  lat: string;
  lon: string;
  display_name: string;
}

// Form validation schema
const formSchema = z.object({
  name: z.string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" }),
  email: z.string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  deepEnd: z.string()
    .trim()
    .min(1, { message: "Deep end depth is required" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Must be a valid positive number",
    }),
  shallowEnd: z.string()
    .trim()
    .min(1, { message: "Shallow end depth is required" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Must be a valid positive number",
    }),
  address: z.string()
    .trim()
    .min(1, { message: "Property address is required" })
    .max(500, { message: "Address must be less than 500 characters" }),
  notes: z.string()
    .trim()
    .max(1000, { message: "Notes must be less than 1000 characters" })
    .optional(),
});

type FormData = z.infer<typeof formSchema>;

const MapContainer = () => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const polygonRef = useRef<L.Polygon | null>(null);
  const [address, setAddress] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasPolygon, setHasPolygon] = useState(false);
  const [perimeterM, setPerimeterM] = useState(0);
  const [areaM2, setAreaM2] = useState(0);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      deepEnd: "",
      shallowEnd: "3.5",
      address: "",
      notes: "",
    },
  });

  // Function to calculate measurements from polygon
  const calculateMeasurements = (layer: L.Polygon) => {
    const latlngs = layer.getLatLngs()[0] as L.LatLng[];
    
    if (latlngs.length < 3) {
      setPerimeterM(0);
      setAreaM2(0);
      return;
    }

    // Transform coordinates to UTM Zone 11N
    const utmCoords = latlngs.map((latlng) => {
      return proj4("EPSG:4326", "EPSG:32611", [latlng.lng, latlng.lat]);
    });

    // Calculate perimeter (sum of edge distances)
    let perimeter = 0;
    for (let i = 0; i < utmCoords.length; i++) {
      const p1 = utmCoords[i];
      const p2 = utmCoords[(i + 1) % utmCoords.length];
      const dx = p2[0] - p1[0];
      const dy = p2[1] - p1[1];
      perimeter += Math.sqrt(dx * dx + dy * dy);
    }

    // Calculate area using shoelace formula
    let area = 0;
    for (let i = 0; i < utmCoords.length; i++) {
      const p1 = utmCoords[i];
      const p2 = utmCoords[(i + 1) % utmCoords.length];
      area += p1[0] * p2[1] - p2[0] * p1[1];
    }
    area = Math.abs(area) / 2;

    setPerimeterM(perimeter);
    setAreaM2(area);
  };

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map centered on San Diego County
    const map = L.map(mapContainerRef.current, {
      center: [32.7157, -117.1611], // San Diego coordinates
      zoom: 13,
      zoomControl: false,
    });

    // Add zoom control to top right
    L.control.zoom({ position: "topright" }).addTo(map);

    // Esri World Imagery (includes NAIP, DigitalGlobe, and other sources)
    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: 'Imagery: Esri, USDA FSA, USGS, Earthstar Geographics',
        maxZoom: 22,
        maxNativeZoom: 20, // Tiles only exist up to 20, but allow zooming to 22
        minZoom: 1,
      }
    ).addTo(map);

    // Configure polygon drawing style
    map.pm.setPathOptions({
      color: '#0066cc',
      fillColor: '#0066cc',
      fillOpacity: 0.3,
      weight: 3,
    });

    // Listen for polygon creation
    map.on('pm:create', (e) => {
      if (e.shape === 'Polygon' && e.layer instanceof L.Polygon) {
        // Remove old polygon if exists
        if (polygonRef.current) {
          polygonRef.current.remove();
        }
        
        const polygon = e.layer as L.Polygon;
        polygonRef.current = polygon;
        setHasPolygon(true);
        setIsDrawing(false);
        
        // Calculate initial measurements
        calculateMeasurements(polygon);
        
        // Enable editing on the new polygon
        polygon.pm.enable();
        
        // Listen for vertex changes
        polygon.on('pm:edit', () => {
          calculateMeasurements(polygon);
        });
        
        toast.success("Pool outline created! You can now drag vertices to adjust.");
      }
    });

    // Listen for polygon removal
    map.on('pm:remove', () => {
      polygonRef.current = null;
      setHasPolygon(false);
      setPerimeterM(0);
      setAreaM2(0);
      toast.info("Pool outline removed");
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const searchAddress = async () => {
    if (!address.trim()) {
      toast.error("Please enter an address");
      return;
    }

    setIsSearching(true);

    try {
      // Use Nominatim (OpenStreetMap) geocoding - free, no API key
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
          new URLSearchParams({
            q: address,
            format: "json",
            limit: "1",
            countrycodes: "us",
          }),
        {
          headers: {
            "User-Agent": "PoolMeasurementApp/1.0",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Geocoding failed");
      }

      const results: GeocodingResult[] = await response.json();

      if (results.length === 0) {
        toast.error("Address not found. Try a different search.");
        return;
      }

      const { lat, lon, display_name } = results[0];
      const latNum = parseFloat(lat);
      const lonNum = parseFloat(lon);

      if (mapRef.current) {
        // Fly to location with smooth animation
        mapRef.current.flyTo([latNum, lonNum], 18, {
          duration: 1.5,
        });

        // Remove previous marker if exists
        if (markerRef.current) {
          markerRef.current.remove();
        }

        // Add new marker
        markerRef.current = L.marker([latNum, lonNum])
          .addTo(mapRef.current)
          .bindPopup(`<strong>${display_name}</strong>`)
          .openPopup();

        toast.success("Location found!");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      toast.error("Unable to find address. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      searchAddress();
    }
  };

  const startDrawing = () => {
    if (!mapRef.current) return;
    
    setIsDrawing(true);
    mapRef.current.pm.enableDraw('Polygon', {
      snappable: true,
      snapDistance: 20,
      finishOn: 'dblclick',
      allowSelfIntersection: false,
    });
    
    toast.info("Click to place vertices. Double-click to finish.");
  };

  const stopDrawing = () => {
    if (!mapRef.current) return;
    
    setIsDrawing(false);
    mapRef.current.pm.disableDraw();
  };

  const clearPolygon = () => {
    if (polygonRef.current) {
      polygonRef.current.remove();
      polygonRef.current = null;
      setHasPolygon(false);
      setPerimeterM(0);
      setAreaM2(0);
      toast.info("Pool outline cleared");
    }
  };

  const undoLastVertex = () => {
    if (!mapRef.current || !isDrawing) return;
    
    // Use Geoman's built-in method to remove last vertex
    const drawPolygon = (mapRef.current.pm.Draw as any).Polygon;
    if (drawPolygon && drawPolygon._removeLastVertex) {
      drawPolygon._removeLastVertex();
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    // TODO: Send to backend (Phase 5)
    console.log("Form submitted:", {
      ...data,
      perimeterM,
      areaM2,
    });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    form.reset();
    setShowLeadForm(false);
  };

  // Convert to imperial units
  const perimeterFt = perimeterM * 3.28084;
  const areaFt2 = areaM2 * 10.7639;

  return (
    <div className="relative w-full h-screen">
      {/* Address Search Bar */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1002] w-full max-w-lg px-4">
        <div className="bg-card rounded-lg shadow-lg border border-border p-3">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter address (e.g., 1234 Ocean View Dr, San Diego, CA)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSearching}
              className="flex-1"
            />
            <Button
              onClick={searchAddress}
              disabled={isSearching}
              size="icon"
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Drawing Controls */}
      <div className="absolute top-36 right-4 z-[1002] flex flex-col gap-2">
        {!isDrawing && !hasPolygon && (
          <Button
            onClick={startDrawing}
            variant="default"
            className="shadow-lg"
          >
            <Pencil className="h-4 w-4 mr-2" />
            Draw Pool
          </Button>
        )}

        {isDrawing && (
          <>
            <Button
              onClick={undoLastVertex}
              variant="secondary"
              className="shadow-lg"
            >
              <Undo className="h-4 w-4 mr-2" />
              Undo Point
            </Button>
            <Button
              onClick={stopDrawing}
              variant="destructive"
              className="shadow-lg"
            >
              Cancel
            </Button>
          </>
        )}

        {hasPolygon && (
          <>
            <Button
              onClick={clearPolygon}
              variant="destructive"
              className="shadow-lg"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
            <Button
              onClick={() => setShowLeadForm(true)}
              variant="default"
              className="shadow-lg"
            >
              Finish & Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </>
        )}
      </div>

      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Measurement Display - Inline */}
      {hasPolygon && (
        <Card className="absolute bottom-20 left-4 z-[1002] bg-card/95 backdrop-blur-sm border-2 border-accent shadow-xl">
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2 text-accent font-bold">
              <Ruler className="h-5 w-5" />
              <span className="text-sm uppercase tracking-wide">Measurements</span>
            </div>
            
            <div className="space-y-2">
              {/* Perimeter */}
              <div className="bg-background/50 rounded-md p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Ruler className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground uppercase">Perimeter</span>
                </div>
                <div className="font-mono font-bold text-lg text-foreground">
                  {perimeterM.toFixed(2)} m
                </div>
                <div className="font-mono text-sm text-muted-foreground">
                  {perimeterFt.toFixed(2)} ft
                </div>
              </div>

              {/* Area */}
              <div className="bg-background/50 rounded-md p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Maximize2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground uppercase">Area</span>
                </div>
                <div className="font-mono font-bold text-lg text-foreground">
                  {areaM2.toFixed(2)} m²
                </div>
                <div className="font-mono text-sm text-muted-foreground">
                  {areaFt2.toFixed(2)} ft²
                </div>
              </div>
            </div>

            <div className="text-xs text-muted-foreground border-t border-border pt-2">
              UTM Zone 11N (EPSG:32611)
            </div>
          </div>
        </Card>
      )}

      {/* Lead Capture Form - Inline */}
      <Dialog open={showLeadForm}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto z-[1003]" overlayClassName="z-[1003]">
          {!isSubmitted ? (
            <>
              <DialogHeader>
                <DialogTitle>Get Your Pool Measurement Report</DialogTitle>
                <DialogDescription>
                  Enter your contact information to receive a detailed measurement summary.
                </DialogDescription>
              </DialogHeader>

              <div className="bg-secondary/50 rounded-lg p-4 my-4 space-y-2">
                <div className="text-sm font-semibold text-foreground">Measured Pool:</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Perimeter</div>
                    <div className="font-mono font-bold">{perimeterM.toFixed(2)} m</div>
                    <div className="font-mono text-xs text-muted-foreground">{perimeterFt.toFixed(2)} ft</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Area</div>
                    <div className="font-mono font-bold">{areaM2.toFixed(2)} m²</div>
                    <div className="font-mono text-xs text-muted-foreground">{areaFt2.toFixed(2)} ft²</div>
                  </div>
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    name="name"
                  render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="email"
                  render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <FormLabel className="block mb-2">Pool Depth (ft) *</FormLabel>
                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        name="deepEnd"
                        render={({ field }: { field: any }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-muted-foreground">Deep End</FormLabel>
                            <FormControl>
                              <Input placeholder="6.5" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="shallowEnd"
                        render={({ field }: { field: any }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-muted-foreground">Shallow End</FormLabel>
                            <FormControl>
                              <Input placeholder="3.5" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    name="address"
                  render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel>Property Address *</FormLabel>
                        <FormControl>
                          <Input placeholder="1234 Ocean View Dr, San Diego, CA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="notes"
                  render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel>Additional Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any special requests or information..."
                            className="resize-none"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Measurement"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </>
          ) : (
            <div className="py-8 text-center space-y-4">
              <div className="flex justify-center">
                <div className="bg-accent/10 rounded-full p-4">
                  <CheckCircle2 className="h-12 w-12 text-accent" />
                </div>
              </div>
              <DialogHeader>
                <DialogTitle>Thank You!</DialogTitle>
                <DialogDescription className="text-base">
                  Your pool measurement has been submitted successfully.
                  We'll contact you shortly with a detailed proposal.
                </DialogDescription>
              </DialogHeader>
              <div className="bg-secondary/50 rounded-lg p-4 space-y-1 text-sm">
                <div className="font-semibold">Measurement Summary:</div>
                <div>Perimeter: {perimeterM.toFixed(2)} m ({perimeterFt.toFixed(2)} ft)</div>
                <div>Area: {areaM2.toFixed(2)} m² ({areaFt2.toFixed(2)} ft²)</div>
              </div>
              <Button onClick={handleClose} className="w-full">
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Attribution Footer */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-card/95 backdrop-blur-sm rounded-md shadow-md px-3 py-2 text-xs text-muted-foreground border border-border">
        Imagery: Esri, USDA FSA, USGS, Earthstar Geographics
      </div>
    </div>
  );
};

export default MapContainer;