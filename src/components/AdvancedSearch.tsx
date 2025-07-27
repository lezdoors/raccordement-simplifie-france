import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Badge } from "@/components/ui/badge";
import { X, Search, Download, RefreshCw } from "lucide-react";
import { DateRange } from "react-day-picker";

interface SearchFilters {
  searchTerm: string;
  status: string;
  assignedTo: string;
  clientType: string;
  connectionType: string;
  projectType: string;
  powerType: string;
  paymentStatus: string;
  dateRange: DateRange | undefined;
  city: string;
  postalCode: string;
}

interface AdvancedSearchProps {
  onFiltersChange: (filters: SearchFilters) => void;
  onExport: () => void;
  onRefresh: () => void;
  canExport?: boolean;
  loading?: boolean;
  totalResults?: number;
}

export const AdvancedSearch = ({
  onFiltersChange,
  onExport,
  onRefresh,
  canExport = false,
  loading = false,
  totalResults = 0
}: AdvancedSearchProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    status: 'all',
    assignedTo: 'all',
    clientType: 'all',
    connectionType: 'all',
    projectType: 'all',
    powerType: 'all',
    paymentStatus: 'all',
    dateRange: undefined,
    city: '',
    postalCode: ''
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  // Apply filters when they change
  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      status: 'all',
      assignedTo: 'all',
      clientType: 'all',
      connectionType: 'all',
      projectType: 'all',
      powerType: 'all',
      paymentStatus: 'all',
      dateRange: undefined,
      city: '',
      postalCode: ''
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.searchTerm) count++;
    if (filters.status !== 'all') count++;
    if (filters.assignedTo !== 'all') count++;
    if (filters.clientType !== 'all') count++;
    if (filters.connectionType !== 'all') count++;
    if (filters.projectType !== 'all') count++;
    if (filters.powerType !== 'all') count++;
    if (filters.paymentStatus !== 'all') count++;
    if (filters.dateRange) count++;
    if (filters.city) count++;
    if (filters.postalCode) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Recherche avancée
            </CardTitle>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount} filtre(s)</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {totalResults} résultat(s)
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            {canExport && (
              <Button
                variant="outline"
                size="sm"
                onClick={onExport}
                disabled={loading}
              >
                <Download className="w-4 h-4 mr-1" />
                Exporter
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Search */}
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Rechercher par nom, email, téléphone..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            Filtres avancés
          </Button>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="text-red-600 hover:text-red-700"
            >
              <X className="w-4 h-4 mr-1" />
              Effacer
            </Button>
          )}
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2">
          <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="nouveau">Nouveau</SelectItem>
              <SelectItem value="en_cours">En cours</SelectItem>
              <SelectItem value="valide">Validé</SelectItem>
              <SelectItem value="refuse">Refusé</SelectItem>
              <SelectItem value="termine">Terminé</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.paymentStatus} onValueChange={(value) => handleFilterChange('paymentStatus', value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Paiement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="paid">Payé</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="failed">Échoué</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.assignedTo} onValueChange={(value) => handleFilterChange('assignedTo', value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Assigné à" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="unassigned">Non assigné</SelectItem>
              <SelectItem value="me">Moi</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-4 pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label>Type de client</Label>
                <Select value={filters.clientType} onValueChange={(value) => handleFilterChange('clientType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="particulier">Particulier</SelectItem>
                    <SelectItem value="professionnel">Professionnel</SelectItem>
                    <SelectItem value="collectivite">Collectivité</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Type de raccordement</Label>
                <Select value={filters.connectionType} onValueChange={(value) => handleFilterChange('connectionType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="nouveau_raccordement">Nouveau raccordement</SelectItem>
                    <SelectItem value="augmentation_puissance">Augmentation puissance</SelectItem>
                    <SelectItem value="raccordement_provisoire">Raccordement provisoire</SelectItem>
                    <SelectItem value="deplacement_compteur">Déplacement compteur</SelectItem>
                    <SelectItem value="autre_demande">Autre demande</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Type de projet</Label>
                <Select value={filters.projectType} onValueChange={(value) => handleFilterChange('projectType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="maison_individuelle">Maison individuelle</SelectItem>
                    <SelectItem value="immeuble_collectif">Immeuble collectif</SelectItem>
                    <SelectItem value="local_commercial">Local commercial</SelectItem>
                    <SelectItem value="batiment_industriel">Bâtiment industriel</SelectItem>
                    <SelectItem value="terrain_nu">Terrain nu</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Ville</Label>
                <Input
                  placeholder="Nom de ville..."
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                />
              </div>

              <div>
                <Label>Code postal</Label>
                <Input
                  placeholder="75000..."
                  value={filters.postalCode}
                  onChange={(e) => handleFilterChange('postalCode', e.target.value)}
                />
              </div>

              <div>
                <Label>Type d'alimentation</Label>
                <Select value={filters.powerType} onValueChange={(value) => handleFilterChange('powerType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="monophase">Monophasé</SelectItem>
                    <SelectItem value="triphase">Triphasé</SelectItem>
                    <SelectItem value="je_ne_sais_pas">Ne sait pas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Période de création</Label>
              <DatePickerWithRange
                date={filters.dateRange}
                onDateChange={(dateRange) => handleFilterChange('dateRange', dateRange)}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};