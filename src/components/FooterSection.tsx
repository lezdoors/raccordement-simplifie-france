import { Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
const FooterSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: ""
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Contact form submitted:", formData);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  return <footer className="bg-slate-800 text-white">
      {/* New Top Section with Logo and Description */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 bg-slate-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex items-center">
            <div className="h-12 w-auto mr-3">
              <img src="/lovable-uploads/55f86fce-e7c0-4a55-95e2-4c1c19dcbc0f.png" alt="raccordement.net" className="h-full w-auto object-contain brightness-0 invert" />
            </div>
            
          </div>
          <div className="flex-1">
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              Gestionnaire du réseau de distribution d'électricité en France, nous raccordons tous types de bâtiments au réseau public.
            </p>
            <div className="flex items-center mt-3">
              <Phone className="w-4 h-4 mr-2 text-blue-400" />
              <a href="tel:0970709570" className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-semibold">
                09 70 70 95 70
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Three Column Layout */}
        <div className="grid md:grid-cols-3 gap-12">
          {/* LEFT COLUMN - Services Particuliers */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-white">Services Particuliers</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                  Raccordement maison neuve
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                  Raccordement photovoltaïque
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                  Modification branchement
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                  Raccordement Enedis
                </a>
              </li>
            </ul>
          </div>

          {/* MIDDLE COLUMN - Services Professionnels */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-white">Services Professionnels</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                  Raccordement industriel
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                  Raccordement chantier
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                  Service express
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                  Estimation coûts
                </a>
              </li>
            </ul>
          </div>

          {/* RIGHT COLUMN - Contact Rapide */}
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">Contact Rapide</h3>
            <p className="text-gray-300 mb-6">Être rappelé gratuitement</p>
            
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              <Input type="text" name="name" placeholder="Votre nom" value={formData.name} onChange={handleInputChange} className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-blue-400" required />
              <Input type="tel" name="phone" placeholder="Votre téléphone" value={formData.phone} onChange={handleInputChange} className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-blue-400" required />
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3">
                Demander un rappel
              </Button>
            </form>

            {/* Business Hours */}
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <Clock className="w-4 h-4 mr-2 text-blue-400" />
                <span className="text-sm">Lun-Ven: 8h-18h</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-blue-400" />
                <a href="tel:0969321800" className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-semibold">
                  09 69 32 18 00
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © 2024 raccordement.net. Tous droits réservés.
          </p>
          <div className="flex space-x-6 text-sm text-gray-400 mt-4 md:mt-0">
            <a href="#" className="hover:text-blue-400 transition-colors duration-200">Mentions légales</a>
            <a href="#" className="hover:text-blue-400 transition-colors duration-200">Confidentialité</a>
            <a href="#" className="hover:text-blue-400 transition-colors duration-200">CGU</a>
          </div>
        </div>
      </div>
    </footer>;
};
export default FooterSection;