export const FAMILIES = ['Nocturna', 'Botánica', 'Cristalina', 'Abisal'] as const;
export const TEMPERAMENTS = ['Pacífica', 'Curiosa', 'Esquiva', 'Indómita'] as const;

export const COLORS = [
  { name: 'Lavanda', hex: '#b8a5d6' },
  { name: 'Pizarra', hex: '#81a8bb' },
  { name: 'Arcilla', hex: '#d5a18b' },
  { name: 'Salvia', hex: '#95a99a' },
  { name: 'Ámbar', hex: '#d9be85' }
] as const;

export type Family = typeof FAMILIES[number];
export type Temperament = typeof TEMPERAMENTS[number];
export type CreatureColor = typeof COLORS[number]['hex'];

export interface CreatureInput {
  name: string;
  family: Family;
  habitat: string;
  temperament: Temperament;
  color: CreatureColor;
  trait: string;
  notes: string;
}

export interface Creature extends CreatureInput {
  id: number;
  createdAt: string;
}

export const EXAMPLES: CreatureInput[] = [
  {
    name: 'Lumi',
    family: 'Nocturna',
    habitat: 'Bosque de niebla',
    temperament: 'Curiosa',
    color: '#b8a5d6',
    trait: 'Antenas que brillan con la luna',
    notes: 'Aparece después de la lluvia. Le gusta seguir las luces que atraviesan los árboles.'
  },
  {
    name: 'Morga',
    family: 'Botánica',
    habitat: 'Jardines olvidados',
    temperament: 'Pacífica',
    color: '#95a99a',
    trait: 'Hojas que cambian con el clima',
    notes: 'Se queda inmóvil durante horas para escuchar cómo crecen las raíces.'
  },
  {
    name: 'Nacre',
    family: 'Cristalina',
    habitat: 'Cuevas de cuarzo',
    temperament: 'Esquiva',
    color: '#81a8bb',
    trait: 'Pequeños cristales en la espalda',
    notes: 'Nunca deja huellas. Sus cristales producen un sonido suave cuando camina.'
  }
];
