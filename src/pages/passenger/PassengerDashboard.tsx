import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransportLayout from "@/components/TransportLayout";
import { MapPin, Clock, Navigation, MessageSquare, Search, Bus, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const liveBuses = [
  { id: "4B-001", route: "Route 4B", location: "Downtown Plaza", eta: "3 min", passengers: 18, status: "on-time" },
  { id: "7A-002", route: "Route 7A", location: "University", eta: "7 min", passengers: 24, status: "delayed" },
  { id: "12C-001", route: "Route 12C", location: "Mall", eta: "12 min", passengers: 8, status: "on-time" },
  { id: "9D-003", route: "Route 9D", location: "Business District", eta: "15 min", passengers: 31, status: "on-time" },
];

const nearbyStops = [
  { name: "Main Street Stop", distance: "50m", routes: ["4B", "7A"], nextBus: "2 min" },
  { name: "Central Plaza", distance: "150m", routes: ["12C", "9D"], nextBus: "5 min" },
  { name: "City Hall", distance: "300m", routes: ["4B", "9D"], nextBus: "8 min" },
];

const PassengerDashboard = () => {
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const { toast } = useToast();

  const reportIssue = (busId: string, route: string) => {
    toast({
      title: "Issue Reported",
      description: `Thank you for reporting an issue with ${route}. We'll investigate immediately.`,
    });
  };

  const planRoute = () => {
    if (!searchFrom || !searchTo) {
      toast({
        title: "Route Planning",
        description: "Please enter both origin and destination.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Route Found",
      description: `Best route: Take Route 4B from ${searchFrom} to ${searchTo}. Estimated journey time: 18 minutes.`,
    });
  };

  return (
    <TransportLayout 
      title="Live Transport" 
      showBackButton={true}
      headerActions={
        <Button variant="outline" size="sm" className="text-primary border-primary/20 hover:bg-primary hover:text-primary-foreground">
          <MessageSquare className="h-4 w-4 mr-1" />
          WhatsApp
        </Button>
      }
    >
      <Tabs defaultValue="live" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="live">Live Buses</TabsTrigger>
          <TabsTrigger value="plan">Plan Route</TabsTrigger>
          <TabsTrigger value="nearby">Nearby Stops</TabsTrigger>
        </TabsList>

        {/* Live Buses Tab */}
        <TabsContent value="live" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bus className="h-5 w-5 mr-2 text-primary" />
                Buses in Real-Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {liveBuses.map((bus) => (
                  <div key={bus.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="outline">{bus.route}</Badge>
                        <Badge 
                          variant={bus.status === "on-time" ? "default" : "destructive"}
                          className={bus.status === "on-time" ? "bg-accent" : ""}
                        >
                          {bus.status}
                        </Badge>
                      </div>
                      <p className="font-medium">{bus.location}</p>
                      <p className="text-sm text-muted-foreground">{bus.passengers} passengers</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">{bus.eta}</p>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => reportIssue(bus.id, bus.route)}
                        className="text-warning hover:text-warning-foreground hover:bg-warning"
                      >
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Report
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Plan Route Tab */}
        <TabsContent value="plan" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Navigation className="h-5 w-5 mr-2 text-primary" />
                Plan Your Journey
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">From</label>
                  <Input 
                    placeholder="Enter origin (e.g., Downtown Plaza)"
                    value={searchFrom}
                    onChange={(e) => setSearchFrom(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">To</label>
                  <Input 
                    placeholder="Enter destination (e.g., Airport Terminal)"
                    value={searchTo}
                    onChange={(e) => setSearchTo(e.target.value)}
                  />
                </div>
                <Button onClick={planRoute} className="w-full bg-gradient-primary hover:bg-primary-dark">
                  <Search className="h-4 w-4 mr-2" />
                  Find Best Route
                </Button>
              </div>

              {/* Sample Route Result */}
              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Suggested Route:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span>Walk 2 min to Main Street Stop</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Bus className="h-4 w-4 text-primary" />
                    <span>Take Route 4B (3 min wait, 15 min journey)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span>Walk 1 min to destination</span>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-accent/10 rounded-lg">
                  <p className="text-sm font-medium text-accent">Total journey time: 21 minutes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Nearby Stops Tab */}
        <TabsContent value="nearby" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                Nearby Bus Stops
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {nearbyStops.map((stop, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{stop.name}</h3>
                      <p className="text-sm text-muted-foreground">{stop.distance} away</p>
                      <div className="flex space-x-1 mt-1">
                        {stop.routes.map((route) => (
                          <Badge key={route} variant="outline" className="text-xs">
                            {route}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">{stop.nextBus}</p>
                      <p className="text-xs text-muted-foreground">next bus</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* WhatsApp Integration */}
          <Card className="shadow-card bg-accent/5 border-accent/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-8 w-8 text-accent" />
                <div className="flex-1">
                  <h3 className="font-medium">No app? No problem!</h3>
                  <p className="text-sm text-muted-foreground">
                    Send "Where is Bus 4B?" to our WhatsApp bot for instant updates
                  </p>
                </div>
                <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                  Try WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </TransportLayout>
  );
};

export default PassengerDashboard;