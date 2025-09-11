import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TransportLayout from "@/components/TransportLayout";
import DriverMap from "./DriverMap";
import { Play, Square, MapPin, Clock, Users, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const routes = [
  { id: "4B", name: "Route 4B", description: "Downtown ↔ Airport", stops: 12 },
  { id: "7A", name: "Route 7A", description: "Central Station ↔ University", stops: 15 },
  { id: "12C", name: "Route 12C", description: "Mall ↔ Industrial Area", stops: 8 },
  { id: "9D", name: "Route 9D", description: "Residential ↔ Business District", stops: 18 },
];

const DriverDashboard = () => {
  const [selectedRoute, setSelectedRoute] = useState<string>("");
  const [isActive, setIsActive] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<string>("Waiting for GPS...");
  const [passengers, setPassengers] = useState(0);
  const [tripDuration, setTripDuration] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive) {
      interval = setInterval(() => {
        setTripDuration(prev => prev + 1);
        // Simulate passenger count changes
        setPassengers(Math.floor(Math.random() * 25) + 5);
        // Simulate location updates
        const locations = ["Stop 1 - Downtown Plaza", "Stop 2 - Main Street", "Stop 3 - City Center", "Stop 4 - Airport Terminal"];
        setCurrentLocation(locations[Math.floor(Math.random() * locations.length)]);
      }, 10000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  const startTrip = () => {
    if (!selectedRoute) {
      toast({
        title: "Route Required",
        description: "Please select a route before starting your trip.",
        variant: "destructive",
      });
      return;
    }

    setIsActive(true);
    setTripDuration(0);
    setCurrentLocation("Starting location - Depot");
    toast({
      title: "Trip Started",
      description: `Now tracking ${routes.find(r => r.id === selectedRoute)?.name}`,
    });
  };

  const endTrip = () => {
    setIsActive(false);
    setCurrentLocation("Trip ended");
    setPassengers(0);
    toast({
      title: "Trip Ended",
      description: `Total trip duration: ${Math.floor(tripDuration / 60)}:${(tripDuration % 60).toString().padStart(2, '0')}`,
    });
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <TransportLayout 
      title="Driver Dashboard" 
      showBackButton={true}
      headerActions={
        <Badge variant={isActive ? "default" : "secondary"} className={isActive ? "bg-accent" : ""}>
          {isActive ? "ACTIVE" : "OFFLINE"}
        </Badge>
      }
    >
      <div className="space-y-6">
        {/* Route Selection */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-primary" />
              Route Selection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select value={selectedRoute} onValueChange={setSelectedRoute} disabled={isActive}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your route" />
                </SelectTrigger>
                <SelectContent>
                  {routes.map((route) => (
                    <SelectItem key={route.id} value={route.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{route.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {route.description} • {route.stops} stops
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex space-x-2">
                <Button 
                  onClick={startTrip} 
                  disabled={isActive || !selectedRoute}
                  className="flex-1 bg-accent hover:bg-accent/90"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Trip
                </Button>
                <Button 
                  onClick={endTrip} 
                  disabled={!isActive}
                  variant="destructive"
                  className="flex-1"
                >
                  <Square className="h-4 w-4 mr-2" />
                  End Trip
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trip Status */}
        {isActive && (
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="text-2xl font-bold text-primary">{formatTime(tripDuration)}</p>
                  </div>
                  <Clock className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Passengers</p>
                    <p className="text-2xl font-bold text-primary">{passengers}</p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="text-lg font-semibold text-accent">In Transit</p>
                  </div>
                  <div className="h-3 w-3 bg-accent rounded-full animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Driver Map */}
        <DriverMap 
          selectedRoute={selectedRoute}
          isActive={isActive}
          currentLocation={currentLocation}
        />

        {/* Current Location */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-primary" />
              Current Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <span className="font-medium">{currentLocation}</span>
              {isActive && <div className="h-2 w-2 bg-accent rounded-full animate-pulse"></div>}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              GPS coordinates are being shared every 10 seconds with the central server
            </p>
          </CardContent>
        </Card>

        {/* Emergency Alert */}
        <Card className="shadow-card border-warning/20">
          <CardContent className="p-4">
            <Button variant="outline" className="w-full border-warning text-warning hover:bg-warning hover:text-warning-foreground">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Report Emergency or Issue
            </Button>
          </CardContent>
        </Card>
      </div>
    </TransportLayout>
  );
};

export default DriverDashboard;