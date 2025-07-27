import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Download, RefreshCw } from 'lucide-react';

interface CRMFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  formTypeFilter: string;
  setFormTypeFilter: (type: string) => void;
  assignedFilter: string;
  setAssignedFilter: (filter: string) => void;
  dateFilter: string;
  setDateFilter: (filter: string) => void;
  onExport: () => void;
  onRefresh: () => void;
  exporting: boolean;
  totalResults: number;
}

export const CRMFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  formTypeFilter,
  setFormTypeFilter,
  assignedFilter,
  setAssignedFilter,
  dateFilter,
  setDateFilter,
  onExport,
  onRefresh,
  exporting,
  totalResults
}: CRMFiltersProps) => {
  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setFormTypeFilter("all");
    setAssignedFilter("all");
    setDateFilter("all");
  };

  const hasActiveFilters = searchTerm || statusFilter !== "all" || formTypeFilter !== "all" || assignedFilter !== "all" || dateFilter !== "all";

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres avancés
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                {totalResults} résultats
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefresh}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Actualiser
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onExport}
              disabled={exporting}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {exporting ? 'Export...' : 'Exporter'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher par nom, email, téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="nouveau">Nouveau</SelectItem>
              <SelectItem value="contacte">Contacté</SelectItem>
              <SelectItem value="en_cours">En cours</SelectItem>
              <SelectItem value="devis_envoye">Devis envoyé</SelectItem>
              <SelectItem value="valide">Validé</SelectItem>
              <SelectItem value="refuse">Refusé</SelectItem>
            </SelectContent>
          </Select>

          <Select value={formTypeFilter} onValueChange={setFormTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="full">Formulaire complet</SelectItem>
              <SelectItem value="quick">Contact rapide</SelectItem>
              <SelectItem value="callback">Demande de rappel</SelectItem>
              <SelectItem value="step1">Formulaire partiel</SelectItem>
            </SelectContent>
          </Select>

          <Select value={assignedFilter} onValueChange={setAssignedFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Assignation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="assigned">Assignés</SelectItem>
              <SelectItem value="unassigned">Non assignés</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les dates</SelectItem>
              <SelectItem value="today">Aujourd'hui</SelectItem>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois-ci</SelectItem>
              <SelectItem value="quarter">Ce trimestre</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            variant="ghost" 
            onClick={resetFilters}
            disabled={!hasActiveFilters}
            className="w-full"
          >
            Réinitialiser
          </Button>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            <span className="text-sm text-muted-foreground">Filtres actifs:</span>
            {searchTerm && (
              <Badge variant="outline" className="flex items-center gap-1">
                Recherche: "{searchTerm}"
                <button onClick={() => setSearchTerm("")} className="ml-1 hover:text-destructive">×</button>
              </Badge>
            )}
            {statusFilter !== "all" && (
              <Badge variant="outline" className="flex items-center gap-1">
                Statut: {statusFilter}
                <button onClick={() => setStatusFilter("all")} className="ml-1 hover:text-destructive">×</button>
              </Badge>
            )}
            {formTypeFilter !== "all" && (
              <Badge variant="outline" className="flex items-center gap-1">
                Type: {formTypeFilter}
                <button onClick={() => setFormTypeFilter("all")} className="ml-1 hover:text-destructive">×</button>
              </Badge>
            )}
            {assignedFilter !== "all" && (
              <Badge variant="outline" className="flex items-center gap-1">
                Assignation: {assignedFilter}
                <button onClick={() => setAssignedFilter("all")} className="ml-1 hover:text-destructive">×</button>
              </Badge>
            )}
            {dateFilter !== "all" && (
              <Badge variant="outline" className="flex items-center gap-1">
                Période: {dateFilter}
                <button onClick={() => setDateFilter("all")} className="ml-1 hover:text-destructive">×</button>
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};