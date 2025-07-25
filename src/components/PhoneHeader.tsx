import { Phone } from "lucide-react";

export const PhoneHeader = () => {
  return (
    <div className="bg-primary text-primary-foreground py-2 px-4 text-center">
      <a 
        href="tel:+33189701200" 
        className="inline-flex items-center gap-2 hover:underline font-medium"
      >
        <Phone className="h-4 w-4" />
        Téléphone : 01 89 70 12 00
      </a>
    </div>
  );
};