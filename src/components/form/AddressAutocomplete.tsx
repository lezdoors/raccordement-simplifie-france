import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string, city?: string, postalCode?: string) => void;
  placeholder?: string;
  className?: string;
}

interface AddressSuggestion {
  properties: {
    label: string;
    score: number;
    housenumber?: string;
    id: string;
    name: string;
    postcode: string;
    citycode: string;
    x: number;
    y: number;
    city: string;
    context: string;
    type: string;
    importance: number;
  };
  geometry: {
    type: string;
    coordinates: [number, number];
  };
}

export const AddressAutocomplete = ({ 
  value, 
  onChange, 
  placeholder = "Tapez votre adresse...",
  className 
}: AddressAutocompleteProps) => {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchAddresses = async () => {
      if (!value || value.length < 3) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(value)}&limit=5`
        );
        const data = await response.json();
        setSuggestions(data.features || []);
      } catch (error) {
        console.error("Error fetching addresses:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchAddresses, 300);
    return () => clearTimeout(debounceTimer);
  }, [value]);

  const handleSelect = (suggestion: AddressSuggestion) => {
    const { properties } = suggestion;
    onChange(properties.label, properties.city, properties.postcode);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setOpen(true);
            }}
            placeholder={placeholder}
            className={cn("pr-10", className)}
          />
          <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        </div>
      </PopoverTrigger>
      
      {suggestions.length > 0 && (
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandList>
              {loading ? (
                <CommandEmpty>Recherche en cours...</CommandEmpty>
              ) : suggestions.length === 0 ? (
                <CommandEmpty>Aucune adresse trouvée</CommandEmpty>
              ) : (
                <CommandGroup>
                  {suggestions.map((suggestion) => (
                    <CommandItem
                      key={suggestion.properties.id}
                      value={suggestion.properties.label}
                      onSelect={() => handleSelect(suggestion)}
                      className="flex items-start space-x-2 p-3"
                    >
                      <MapPin className="w-4 h-4 mt-1 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {suggestion.properties.label}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {suggestion.properties.context}
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      )}
    </Popover>
  );
};