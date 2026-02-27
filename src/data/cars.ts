const img = (name: string) =>
  new URL(`../assets/cars/${name}`, import.meta.url).href;

export type Car = {
  id: string;
  brand: string;
  model: string;
  type: string;
  price: number;
  rating: number;
  images: string[];
  condition?: 'New' | 'Used';
};

export const CARS: Car[] = [
  {
    id: 'bmw-m5',
    brand: 'BMW',
    model: 'M5 Series',
    type: 'Sedan',
    price: 175000,
    rating: 4.8,
    condition: 'New',
    images: [img('bmw_m5.png'), img('bmw_m5_1.png')],
  },
  {
    id: 'ferrari-race',
    brand: 'Ferrari',
    model: 'Race Edition',
    type: 'Sports',
    price: 185000,
    rating: 4.9,
    condition: 'Used',
    images: [img('ferrari_race.png'), img('ferrari_race1.png')],
  },
  {
    id: 'camaro',
    brand: 'Chevrolet',
    model: 'Camaro',
    type: 'Coupe',
    price: 170000,
    rating: 4.7,
    condition: 'New',
    images: [img('chevrolet_camaro.png'), img('chevrolet_camaro1.png')],
  },
  {
    id: 'mclaren-720',
    brand: 'McLaren',
    model: '720S',
    type: 'Sports',
    price: 250000,
    rating: 4.9,
    condition: 'Used',
    images: [img('mclaren_720s.png'), img('mclaren_720s1.png')], 
  },
  {
    id: 'subaru-wrx',
    brand: 'Subaru',
    model: 'WRX STI',
    type: 'Sedan',
    price: 95000,
    rating: 4.6,
    condition: 'Used',
    images: [img('subaru_wrx.png'), img('subaru_wrx1.png')],
  },
  {
    id: 'lamborghini',
    brand: 'Lamborghini',
    model: 'Huracan',
    type: 'Sports',
    price: 320000,
    rating: 5.0,
    condition: 'New',
    images: [img('lamborghini_huracan.png'), img('lamborghini_huracan1.png')],
  },
  {
    id: 'mclaren-black',
    brand: 'McLaren',
    model: 'Black Series',
    type: 'Sports',
    price: 280000,
    rating: 4.9,
    condition: 'Used',
    images: [img('mclaren_black.png'), img('mclaren_black1.png')],
  },
  {
    id: 'jaguar',
    brand: 'Jaguar',
    model: 'F-Type',
    type: 'Coupe',
    price: 145000,
    rating: 4.7,
    condition: 'New',
    images: [img('jaguar_f_type.png'), img('jaguar_f_type1.png')],
  },
];