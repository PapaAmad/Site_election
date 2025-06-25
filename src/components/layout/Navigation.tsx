import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu,
  Vote,
  Users,
  BarChart3,
  Settings,
  LogOut,
  User,
  FileText,
  CheckSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserRole } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";

interface NavigationProps {
  currentUser?: {
    role: UserRole;
    firstName: string;
    lastName: string;
  };
  onLogout?: () => void;
}

const Navigation = ({
  currentUser: propCurrentUser,
  onLogout: propOnLogout,
}: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { currentUser: contextUser, logout: contextLogout } = useAuth();

  // Use prop values if provided, otherwise use context values
  const currentUser = propCurrentUser || contextUser;
  const onLogout = propOnLogout || contextLogout;

  const getNavigationItems = () => {
    if (!currentUser) return [];

    const commonItems = [{ href: "/", label: "Accueil", icon: Vote }];

    switch (currentUser.role) {
      case UserRole.ADMIN:
        return [
          ...commonItems,
          { href: "/admin", label: "Tableau de bord", icon: BarChart3 },
          { href: "/admin/elections", label: "Élections", icon: Vote },
          { href: "/admin/candidates", label: "Candidatures", icon: Users },
          { href: "/admin/voters", label: "Électeurs", icon: CheckSquare },
          { href: "/admin/results", label: "Résultats", icon: BarChart3 },
          { href: "/admin/settings", label: "Paramètres", icon: Settings },
        ];

      case UserRole.CANDIDATE:
        return [
          ...commonItems,
          { href: "/candidate/dashboard", label: "Mon espace", icon: User },
          {
            href: "/candidate/application",
            label: "Ma candidature",
            icon: FileText,
          },
          { href: "/results", label: "Résultats", icon: BarChart3 },
        ];

      case UserRole.VOTER:
        return [
          ...commonItems,
          { href: "/vote", label: "Voter", icon: Vote },
          { href: "/results", label: "Résultats", icon: BarChart3 },
        ];

      case UserRole.SPECTATOR:
        return [
          ...commonItems,
          { href: "/results", label: "Résultats", icon: BarChart3 },
        ];

      default:
        return commonItems;
    }
  };

  const navigationItems = getNavigationItems();

  const NavItems = ({ onItemClick }: { onItemClick?: () => void }) => (
    <>
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;

        return (
          <Link
            key={item.href}
            to={item.href}
            onClick={onItemClick}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent",
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </>
  );

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary rounded-md p-2">
              <Vote className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              VoteSecure
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavItems />
          </div>

          {/* User Menu & Mobile Toggle */}
          <div className="flex items-center space-x-4">
            {currentUser && (
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-sm">
                  <div className="font-medium text-foreground">
                    {currentUser.firstName} {currentUser.lastName}
                  </div>
                  <div className="text-muted-foreground capitalize">
                    {currentUser.role}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Ouvrir le menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {currentUser && (
                    <div className="pb-4 border-b border-border">
                      <div className="font-medium text-foreground">
                        {currentUser.firstName} {currentUser.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground capitalize">
                        {currentUser.role}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col space-y-2">
                    <NavItems onItemClick={() => setIsOpen(false)} />
                  </div>

                  {currentUser && (
                    <div className="pt-4 border-t border-border">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          onLogout?.();
                          setIsOpen(false);
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Se déconnecter
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
