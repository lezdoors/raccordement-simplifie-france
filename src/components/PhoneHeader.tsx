import { Phone } from "lucide-react";

export const PhoneHeader = () => {
  return (
    <div className="bg-primary text-primary-foreground py-2 px-4 text-center">
      <a 
        href="tel:+33970709570" 
        className="inline-flex items-center gap-2 hover:underline font-medium"
        aria-label="Appeler le 09 70 70 95 70"
      >
        <Phone className="h-4 w-4" />
        Téléphone : 09 70 70 95 70
      </a>
    </div>
  );
};