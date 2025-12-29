import { GridId } from './Grid';
import { SpeciesId } from './Species';

export interface GridSpeciesOccurrence {
  gridId: GridId
  speciesId: SpeciesId
  year: number
  observationCount: number
}