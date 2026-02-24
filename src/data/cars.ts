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
};

export const CARS: Car[] = [
  {
    id: 'bmw-m5',
    brand: 'BMW',
    model: 'M5 Series',
    type: 'Sedan',
    price: 175000,
    rating: 4.8,
    images: [img('bmw_m5.png')],
  },
  {
    id: 'ferrari-race',
    brand: 'Ferrari',
    model: 'Race Edition',
    type: 'Sports',
    price: 185000,
    rating: 4.9,
    images: [img('ferrari_race.png')],
  },
  {
    id: 'camaro',
    brand: 'Chevrolet',
    model: 'Camaro',
    type: 'Coupe',
    price: 170000,
    rating: 4.7,
    images: [img('chevrolet_camaro.png')],
  },
  {
    id: 'mclaren-720',
    brand: 'McLaren',
    model: '720S',
    type: 'Sports',
    price: 250000,
    rating: 4.9,
    images: [img('mclaren_720s.png')], 
  },
  {
    id: 'subaru-wrx',
    brand: 'Subaru',
    model: 'WRX STI',
    type: 'Sedan',
    price: 95000,
    rating: 4.6,
    images: [img('subaru_wrx.png')],
  },
  {
    id: 'lamborghini',
    brand: 'Lamborghini',
    model: 'Huracan',
    type: 'Sports',
    price: 320000,
    rating: 5.0,
    images: [img('lamborghini_huracan.png')],
  },
  {
    id: 'mclaren-black',
    brand: 'McLaren',
    model: 'Black Series',
    type: 'Sports',
    price: 280000,
    rating: 4.9,
    images: [img('mclaren_black.png')],
  },
  {
    id: 'jaguar',
    brand: 'Jaguar',
    model: 'F-Type',
    type: 'Coupe',
    price: 145000,
    rating: 4.7,
    images: [img('jaguar_f_type.png')],
  },
];