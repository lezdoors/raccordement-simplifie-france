import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const MobileContactBar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-primary text-white p-4 shadow-lg border-t border-primary/20 z-50 md:hidden">
      <Button 
        asChild 
        className="w-full bg-white text-primary hover:bg-white/90 font-semibold min-h-[48px] touch-target"
      >
        <a href="tel:0970959570" className="flex items-center justify-center gap-2">
          <Phone className="w-5 h-5" />
          Contacter un expert - 09 70 95 95 70
        </a>
      </Button>
    </div>
  );
};

export default MobileContactBar;