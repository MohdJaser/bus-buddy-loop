import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TransportLayoutProps {
  children: ReactNode;
  title: string;
  showBackButton?: boolean;
  headerActions?: ReactNode;
}

const TransportLayout = ({ children, title, showBackButton = false, headerActions }: TransportLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground shadow-transport">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {showBackButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(-1)}
                  className="text-primary-foreground hover:bg-white/20"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <div className="flex items-center space-x-2">
                <MapPin className="h-6 w-6" />
                <h1 className="text-xl font-bold">{title}</h1>
              </div>
            </div>
            {headerActions && (
              <div className="flex items-center space-x-2">
                {headerActions}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default TransportLayout;