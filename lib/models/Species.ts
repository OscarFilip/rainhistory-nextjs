export type SpeciesId = string

export interface Species {
  id: SpeciesId
  swedishName: string
  scientificName: string
  edible: boolean
}