export interface SearchFilters {
  q?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  categoryId?: string;
  locationName?: string;
  filter?: string[];
  sort?: string;
  limit?: number;
  offset?: number;
}
