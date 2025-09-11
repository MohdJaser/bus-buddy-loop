/// <reference types="google.maps" />
import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Bus {
  id: string;
  route: string;
  lat: number;
  lng: number;
  status: "on-time" | "delayed" | "early";
  passengers: number;
  eta: string;
}

const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY_HERE"; // Replace with your actual API key

const LiveMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const [isLoaded, setIsLoaded] = useState(false);
  const [apiKey, setApiKey] = useState(GOOGLE_MAPS_API_KEY);
  const [showApiKeyInput, setShowApiKeyInput] = useState(GOOGLE_MAPS_API_KEY === "YOUR_GOOGLE_MAPS_API_KEY_HERE");
  const { toast } = useToast();

  // Simulated live bus data
  const [buses] = useState<Bus[]>([
    { id: "4B-001", route: "Route 4B", lat: 40.7128, lng: -74.0060, status: "on-time", passengers: 18, eta: "3 min" },
    { id: "7A-002", route: "Route 7A", lat: 40.7589, lng: -73.9851, status: "delayed", passengers: 24, eta: "7 min" },
    { id: "12C-001", route: "Route 12C", lat: 40.7505, lng: -73.9934, status: "on-time", passengers: 8, eta: "12 min" },
    { id: "9D-003", route: "Route 9D", lat: 40.7282, lng: -73.7949, status: "early", passengers: 31, eta: "15 min" },
  ]);

  const initializeMap = async () => {
    if (!mapRef.current || !apiKey || apiKey === "YOUR_GOOGLE_MAPS_API_KEY_HERE") return;

    try {
      const loader = new Loader({
        apiKey: apiKey,
        version: "weekly",
        libraries: ["maps"]
      });

      await loader.load();

      // Initialize map centered on New York City
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 40.7128, lng: -74.0060 },
        zoom: 12,
        styles: [
          {
            featureType: "transit",
            elementType: "geometry",
            stylers: [{ color: "#2563eb" }]
          }
        ]
      });

      mapInstance.current = map;
      setIsLoaded(true);

      // Add bus markers
      buses.forEach(bus => {
        addBusMarker(bus);
      });

      toast({
        title: "Map Loaded",
        description: "Google Maps loaded successfully with live bus tracking!",
      });

    } catch (error) {
      console.error("Error loading Google Maps:", error);
      toast({
        title: "Map Error",
        description: "Failed to load Google Maps. Please check your API key.",
        variant: "destructive",
      });
    }
  };

  const addBusMarker = (bus: Bus) => {
    if (!mapInstance.current) return;

    const icon = {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="18" fill="${bus.status === 'on-time' ? '#16a34a' : bus.status === 'delayed' ? '#dc2626' : '#2563eb'}" stroke="white" stroke-width="2"/>
          <text x="20" y="14" text-anchor="middle" fill="white" font-size="8" font-weight="bold">${bus.route.split(' ')[1]}</text>
          <text x="20" y="26" text-anchor="middle" fill="white" font-size="6">${bus.passengers}</text>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(40, 40),
    };

    const marker = new google.maps.Marker({
      position: { lat: bus.lat, lng: bus.lng },
      map: mapInstance.current,
      title: `${bus.route} - ${bus.eta}`,
      icon: icon,
    });

    // Info window for bus details
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="padding: 8px;">
          <h3 style="margin: 0; color: #2563eb;">${bus.route}</h3>
          <p style="margin: 4px 0;"><strong>ETA:</strong> ${bus.eta}</p>
          <p style="margin: 4px 0;"><strong>Passengers:</strong> ${bus.passengers}</p>
          <p style="margin: 4px 0;"><strong>Status:</strong> ${bus.status}</p>
        </div>
      `
    });

    marker.addListener("click", () => {
      infoWindow.open(mapInstance.current, marker);
    });

    markersRef.current.set(bus.id, marker);
  };

  const updateApiKey = () => {
    if (apiKey && apiKey !== "YOUR_GOOGLE_MAPS_API_KEY_HERE") {
      setShowApiKeyInput(false);
      initializeMap();
    } else {
      toast({
        title: "API Key Required",
        description: "Please enter a valid Google Maps API key.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!showApiKeyInput) {
      initializeMap();
    }
  }, [showApiKeyInput]);

  // Simulate real-time updates
  useEffect(() => {
    if (!isLoaded) return;

    const interval = setInterval(() => {
      buses.forEach(bus => {
        // Simulate small movements
        const newLat = bus.lat + (Math.random() - 0.5) * 0.001;
        const newLng = bus.lng + (Math.random() - 0.5) * 0.001;
        
        const marker = markersRef.current.get(bus.id);
        if (marker) {
          marker.setPosition({ lat: newLat, lng: newLng });
        }
        
        bus.lat = newLat;
        bus.lng = newLng;
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [isLoaded, buses]);

  if (showApiKeyInput) {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2 text-primary" />
            Google Maps Setup Required
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            To enable real-time bus tracking, please enter your Google Maps API key.
          </p>
          <div className="space-y-2">
            <label className="text-sm font-medium">Google Maps API Key</label>
            <Input 
              type="password"
              placeholder="Enter your Google Maps API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
          <Button onClick={updateApiKey} className="w-full bg-gradient-primary hover:bg-primary-dark">
            Load Map
          </Button>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Get your API key from Google Cloud Console</p>
            <p>• Enable Maps JavaScript API</p>
            <p>• Add billing information (free tier available)</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-primary" />
            Live Bus Tracking
          </div>
          <Badge variant="default" className="bg-accent">
            {buses.length} buses tracked
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          ref={mapRef} 
          className="w-full h-96 rounded-lg shadow-inner"
          style={{ minHeight: "400px" }}
        />
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>Updates every 5 seconds</span>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowApiKeyInput(true)}
          >
            <Settings className="h-3 w-3 mr-1" />
            Change API Key
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveMap;