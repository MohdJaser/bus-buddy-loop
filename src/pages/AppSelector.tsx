import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bus, User, MapPin, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AppSelector = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Hero Section */}
        <div className="text-center text-white mb-12">
          <div className="flex items-center justify-center mb-6">
            <MapPin className="h-16 w-16 mr-4" />
            <h1 className="text-5xl font-bold">TransitTrack</h1>
          </div>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Real-time public transport tracking for drivers, passengers, and city authorities
          </p>
        </div>

        {/* App Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Driver App */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-card hover:shadow-transport transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-gradient-primary rounded-full w-20 h-20 flex items-center justify-center">
                <Bus className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-primary">Driver App</CardTitle>
              <CardDescription className="text-lg">
                For bus drivers to share live location and manage routes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2 text-accent" />
                  Real-time GPS tracking
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2 text-accent" />
                  Route management
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Bus className="h-4 w-4 mr-2 text-accent" />
                  Trip analytics
                </div>
              </div>
              <Button 
                onClick={() => navigate('/driver')}
                className="w-full bg-gradient-primary hover:bg-primary-dark text-white font-semibold"
              >
                Open Driver App
              </Button>
            </CardContent>
          </Card>

          {/* Passenger App */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-card hover:shadow-transport transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-gradient-primary rounded-full w-20 h-20 flex items-center justify-center">
                <User className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-primary">Passenger App</CardTitle>
              <CardDescription className="text-lg">
                Track buses, plan routes, and get real-time updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2 text-accent" />
                  Live bus tracking
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2 text-accent" />
                  Real-time ETAs
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <User className="h-4 w-4 mr-2 text-accent" />
                  Community reports
                </div>
              </div>
              <Button 
                onClick={() => navigate('/passenger')}
                className="w-full bg-gradient-primary hover:bg-primary-dark text-white font-semibold"
              >
                Open Passenger App
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Banner */}
        <div className="text-center text-white mt-12">
          <p className="text-sm opacity-75">
            Featuring WhatsApp integration, community reporting, and real-time analytics
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppSelector;