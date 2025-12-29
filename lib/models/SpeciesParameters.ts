import { SpeciesId } from "./Species"

export interface SpeciesParameters {
  speciesId: SpeciesId

  fruitingStartDay: number
  fruitingEndDay: number
  peakDay?: number

  minTemp: number
  optimalTemp: number
  maxTemp: number

  minRain14d: number
  optimalRain14d: number

  growthDaysToEdible: number
  overmatureAfterDays: number
}