import { paisfotos } from './pais-fotos'
import { paisPersonagens } from './pais-personagens'

export const categories = {
  'Canecas com Fotos': paisfotos,
  'Canecas com Personagens': paisPersonagens,
} satisfies Record<string, Category>

export const categoriesEntries = Object.entries(categories)
