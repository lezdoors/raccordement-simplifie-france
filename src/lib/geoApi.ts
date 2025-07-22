// French government API for postal code to city lookup
export const fetchCityFromPostalCode = async (postalCode: string): Promise<string[]> => {
  try {
    if (!postalCode || postalCode.length !== 5) {
      return [];
    }

    const response = await fetch(`https://geo.api.gouv.fr/communes?codePostal=${postalCode}&fields=nom&format=json`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Return array of city names
    return data.map((city: { nom: string }) => city.nom);
  } catch (error) {
    console.error('Error fetching city from postal code:', error);
    return [];
  }
};