/// <reference types="google.maps" />
import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY_HERE"; // Replace with your actual API key

interface DriverMapProps {
  selectedRoute: string;
  isActive: boolean;
  currentLocation: string;
}

const DriverMap = ({ selectedRoute, isActive, currentLocation }: DriverMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const driverMarker = useRef<google.maps.Marker | null>(null);
  const routePath = useRef<google.maps.Polyline | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentPosition, setCurrentPosition] = useState({ lat: 40.7128, lng: -74.0060 });
  const { toast } = useToast();

  // Route stops data
  const routeStops = {
    "4B": [
      { name: "Downtown Plaza", lat: 40.7128, lng: -74.0060 },
      { name: "Main Street", lat: 40.7282, lng: -73.9942 },
      { name: "City Center", lat: 40.7505, lng: -73.9934 },
      { name: "Airport Terminal", lat: 40.7589, lng: -73.9851 },
    ],
    "7A": [
      { name: "Central Station", lat: 40.7505, lng: -73.9934 },
      { name: "University", lat: 40.7589, lng: -73.9851 },
      { name: "Library", lat: 40.7614, lng: -73.9776 },
      { name: "Hospital", lat: 40.7505, lng: -73.9934 },
    ],
    "12C": [
      { name: "Mall", lat: 40.7282, lng: -73.7949 },
      { name: "Shopping Center", lat: 40.7128, lng: -73.8370 },
      { name: "Industrial Area", lat: 40.6892, lng: -73.9442 },
    ],
    "9D": [
      { name: "Residential", lat: 40.7505, lng: -73.9934 },
      { name: "Park", lat: 40.7829, lng: -73.9654 },
      { name: "Business District", lat: 40.7589, lng: -73.9851 },
      { name: "Convention Center", lat: 40.7505, lng: -73.9934 },
    ],
  };

  const initializeMap = async () => {
    if (!mapRef.current) return;

    try {
      const loader = new Loader({
        apiKey: GOOGLE_MAPS_API_KEY,
        version: "weekly",
        libraries: ["maps"]
      });

      await loader.load();

      const map = new google.maps.Map(mapRef.current, {
        center: currentPosition,
        zoom: 13,
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

      // Add driver marker
      driverMarker.current = new google.maps.Marker({
        position: currentPosition,
        map: map,
        title: "Your Bus",
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
              <circle cx="25" cy="25" r="22" fill="#2563eb" stroke="white" stroke-width="3"/>
              <text x="25" y="18" text-anchor="middle" fill="white" font-size="10" font-weight="bold">BUS</text>
              <text x="25" y="32" text-anchor="middle" fill="white" font-size="8">${selectedRoute}</text>
            </svg>
          `)}`,
          scaledSize: new google.maps.Size(50, 50),
        }
      });

    } catch (error) {
      console.error("Error loading Google Maps:", error);
    }
  };

  const drawRoute = () => {
    if (!mapInstance.current || !selectedRoute) return;

    const stops = routeStops[selectedRoute as keyof typeof routeStops];
    if (!stops) return;

    // Clear existing route
    if (routePath.current) {
      routePath.current.setMap(null);
    }

    // Draw route line
    routePath.current = new google.maps.Polyline({
      path: stops,
      geodesic: true,
      strokeColor: "#2563eb",
      strokeOpacity: 1.0,
      strokeWeight: 4,
    });

    routePath.current.setMap(mapInstance.current);

    // Add stop markers
    stops.forEach((stop, index) => {
      new google.maps.Marker({
        position: stop,
        map: mapInstance.current,
        title: stop.name,
        label: {
          text: (index + 1).toString(),
          color: "white",
          fontWeight: "bold",
        },
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
              <circle cx="15" cy="15" r="12" fill="#16a34a" stroke="white" stroke-width="2"/>
            </svg>
          `)}`,
          scaledSize: new google.maps.Size(30, 30),
        }
      });
    });

    // Fit map to show all stops
    const bounds = new google.maps.LatLngBounds();
    stops.forEach(stop => bounds.extend(stop));
    mapInstance.current.fitBounds(bounds);
  };

  // Simulate GPS movement along route
  useEffect(() => {
    if (!isActive || !isLoaded || !selectedRoute) return;

    const stops = routeStops[selectedRoute as keyof typeof routeStops];
    if (!stops) return;

    let currentStopIndex = 0;
    
    const interval = setInterval(() => {
      if (currentStopIndex < stops.length) {
        const nextStop = stops[currentStopIndex];
        const newPosition = {
          lat: nextStop.lat + (Math.random() - 0.5) * 0.002,
          lng: nextStop.lng + (Math.random() - 0.5) * 0.002,
        };

        setCurrentPosition(newPosition);
        
        if (driverMarker.current) {
          driverMarker.current.setPosition(newPosition);
        }

        if (mapInstance.current) {
          mapInstance.current.panTo(newPosition);
        }

        currentStopIndex = (currentStopIndex + 1) % stops.length;
      }
    }, 15000); // Move to next area every 15 seconds

    return () => clearInterval(interval);
  }, [isActive, isLoaded, selectedRoute]);

  useEffect(() => {
    if (GOOGLE_MAPS_API_KEY !== "YOUR_GOOGLE_MAPS_API_KEY_HERE") {
      initializeMap();
    }
  }, []);

  useEffect(() => {
    if (isLoaded && selectedRoute) {
      drawRoute();
    }
  }, [isLoaded, selectedRoute]);

  if (GOOGLE_MAPS_API_KEY === "YOUR_GOOGLE_MAPS_API_KEY_HERE") {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-primary" />
            Driver Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Google Maps API key required for driver navigation
            </p>
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
            <Navigation className="h-5 w-5 mr-2 text-primary" />
            Driver Navigation
          </div>
          {isActive && (
            <Badge variant="default" className="bg-accent">
              GPS Active
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          ref={mapRef} 
          className="w-full h-80 rounded-lg shadow-inner mb-4"
          style={{ minHeight: "320px" }}
        />
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Current Location:</span>
            <span className="font-medium">{currentLocation}</span>
          </div>
          
          {selectedRoute && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Route:</span>
              <Badge variant="outline">{selectedRoute}</Badge>
            </div>
          )}
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">GPS Status:</span>
            <span className={`font-medium ${isActive ? 'text-accent' : 'text-muted-foreground'}`}>
              {isActive ? 'Transmitting' : 'Inactive'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DriverMap;