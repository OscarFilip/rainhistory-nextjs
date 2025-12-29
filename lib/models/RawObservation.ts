import { SpeciesId } from "./Species";

export type ObservationId = string;

export interface RawObservation {
  id: ObservationId
  speciesId: SpeciesId
  lat: number
  lon: number
  uncertaintyMeters: number
  observedAt: Date
  verified: boolean
}