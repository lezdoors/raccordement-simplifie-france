import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const MobileContactBar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-primary text-white p-3 shadow-lg border-t border-primary/20 z-50 md:hidden">
      <Button 
        asChild 
        className="w-full bg-white text-primary hover:bg-white/90 font-bold text-lg min-h-[56px] touch-target shadow-lg"
      >
        <a href="tel:0970959570" className="flex items-center justify-center gap-3">
          <Phone className="w-6 h-6" />
          <span>Contacter un expert - 09 70 95 95 70</span>
        </a>
      </Button>
    </div>
  );
};

export default MobileContactBar;