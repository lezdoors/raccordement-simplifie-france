import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Phone, Mail, FileText, Home, Users, HelpCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { name: "Accueil", href: "/", icon: Home },
    { name: "Raccordement Enedis", href: "/commencer", icon: FileText },
    { name: "À propos", href: "/a-propos", icon: Users },
    { name: "Contact", href: "/contact", icon: Mail },
    { name: "FAQ", href: "/faq", icon: HelpCircle },
  ];

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-white">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-72">
          <SheetHeader>
            <SheetTitle className="text-left">Menu</SheetTitle>
            <SheetDescription className="text-left">
              Naviguez facilement sur notre site
            </SheetDescription>
          </SheetHeader>
          
          <nav className="mt-6 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Contact CTA */}
          <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <h3 className="font-semibold text-primary mb-2">Besoin d'aide ?</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Contactez nos experts pour votre raccordement
            </p>
            <div className="space-y-2">
              <Button asChild className="w-full" size="sm">
                <a href="tel:0123456789">
                  <Phone className="h-4 w-4 mr-2" />
                  01 23 45 67 89
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full" size="sm">
                <a href="mailto:contact@raccordement-elec.fr">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </a>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavigation;