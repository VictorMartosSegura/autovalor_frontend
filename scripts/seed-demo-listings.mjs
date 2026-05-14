import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const apiBaseUrl = process.env.VITE_API_BASE_URL || process.env.API_BASE_URL || 'http://localhost:8080';
const carsDir = path.join(projectRoot, 'src', 'assets', 'cars');

const demoListings = [
  {
    user: { name: 'Pruebas 1', email: 'pruebas1@gmail.com', password: 'prueba11' },
    images: ['bmw_m5.png', 'bmw_m5_1.png'],
    listing: {
      title: 'BMW M5 Competition',
      description: 'BMW M5 Competition en excelente estado, muy cuidado, con altas prestaciones y acabado deportivo.',
      price: 72000,
      brand: 'BMW',
      model: 'M5 Competition',
      year: 2021,
      km: 42000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      location: 'Barcelona',
      province: 'Barcelona',
      sellerType: 'Private seller',
      bodyType: 'Sedan',
      doors: 4,
      powerCv: 625,
      engineSize: '4.4 V8',
      environmentalLabel: 'C',
      warranty: true,
      color: 'Blue',
      registrationMonth: 5,
      registrationYear: 2021,
      previousOwners: 1,
      financeable: true,
      maintenanceBook: true,
    },
  },
  {
    user: { name: 'Pruebas 2', email: 'pruebas2@gmail.com', password: 'prueba22' },
    images: ['chevrolet_camaro.png', 'chevrolet_camaro1.png'],
    listing: {
      title: 'Chevrolet Camaro SS',
      description: 'Chevrolet Camaro con estética deportiva, motor potente y sonido espectacular. Ideal para amantes de los muscle cars.',
      price: 48500,
      brand: 'Chevrolet',
      model: 'Camaro SS',
      year: 2019,
      km: 58000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      location: 'Madrid',
      province: 'Madrid',
      sellerType: 'Private seller',
      bodyType: 'Coupe',
      doors: 2,
      powerCv: 455,
      engineSize: '6.2 V8',
      environmentalLabel: 'C',
      warranty: false,
      color: 'Yellow',
      registrationMonth: 9,
      registrationYear: 2019,
      previousOwners: 2,
      financeable: true,
      maintenanceBook: true,
    },
  },
  {
    user: { name: 'Pruebas 3', email: 'pruebas3@gmail.com', password: 'prueba33' },
    images: ['ferrari_race.png', 'ferrari_race1.png'],
    listing: {
      title: 'Ferrari 488 GTB',
      description: 'Ferrari 488 GTB con configuración deportiva, interior cuidado y mantenimiento al día.',
      price: 198000,
      brand: 'Ferrari',
      model: '488 GTB',
      year: 2018,
      km: 26000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      location: 'Valencia',
      province: 'Valencia',
      sellerType: 'Private seller',
      bodyType: 'Coupe',
      doors: 2,
      powerCv: 670,
      engineSize: '3.9 V8',
      environmentalLabel: 'C',
      warranty: true,
      color: 'Red',
      registrationMonth: 3,
      registrationYear: 2018,
      previousOwners: 1,
      financeable: false,
      maintenanceBook: true,
    },
  },
  {
    user: { name: 'Pruebas 4', email: 'pruebas4@gmail.com', password: 'prueba44' },
    images: ['jaguar_f_type.png', 'jaguar_f_type1.png'],
    listing: {
      title: 'Jaguar F-Type R',
      description: 'Jaguar F-Type R con diseño elegante, sonido deportivo y conducción muy dinámica.',
      price: 67500,
      brand: 'Jaguar',
      model: 'F-Type R',
      year: 2020,
      km: 39000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      location: 'Sevilla',
      province: 'Sevilla',
      sellerType: 'Private seller',
      bodyType: 'Coupe',
      doors: 2,
      powerCv: 575,
      engineSize: '5.0 V8',
      environmentalLabel: 'C',
      warranty: true,
      color: 'White',
      registrationMonth: 7,
      registrationYear: 2020,
      previousOwners: 1,
      financeable: true,
      maintenanceBook: true,
    },
  },
  {
    user: { name: 'Pruebas 5', email: 'pruebas5@gmail.com', password: 'prueba55' },
    images: ['lamborghini_huracan.png', 'lamborghini_huracan1.png'],
    listing: {
      title: 'Lamborghini Huracan EVO',
      description: 'Lamborghini Huracan EVO en estado impecable, configuración llamativa y prestaciones de superdeportivo.',
      price: 235000,
      brand: 'Lamborghini',
      model: 'Huracan EVO',
      year: 2021,
      km: 18000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      location: 'Marbella',
      province: 'Malaga',
      sellerType: 'Private seller',
      bodyType: 'Coupe',
      doors: 2,
      powerCv: 640,
      engineSize: '5.2 V10',
      environmentalLabel: 'C',
      warranty: true,
      color: 'Green',
      registrationMonth: 6,
      registrationYear: 2021,
      previousOwners: 1,
      financeable: false,
      maintenanceBook: true,
    },
  },
  {
    user: { name: 'Pruebas 6', email: 'pruebas6@gmail.com', password: 'prueba66' },
    images: ['mclaren_720s.png', 'mclaren_720s1.png'],
    listing: {
      title: 'McLaren 720S Performance',
      description: 'McLaren 720S con acabado Performance, muy ligero, rápido y con historial de mantenimiento completo.',
      price: 249000,
      brand: 'McLaren',
      model: '720S Performance',
      year: 2020,
      km: 22000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      location: 'Barcelona',
      province: 'Barcelona',
      sellerType: 'Private seller',
      bodyType: 'Coupe',
      doors: 2,
      powerCv: 720,
      engineSize: '4.0 V8',
      environmentalLabel: 'C',
      warranty: true,
      color: 'Orange',
      registrationMonth: 11,
      registrationYear: 2020,
      previousOwners: 1,
      financeable: true,
      maintenanceBook: true,
    },
  },
  {
    user: { name: 'Pruebas 7', email: 'pruebas7@gmail.com', password: 'prueba77' },
    images: ['mclaren_black.png', 'mclaren_black1.png'],
    listing: {
      title: 'McLaren GT Black Edition',
      description: 'McLaren GT en color negro, diseño elegante y prestaciones de alto nivel para uso deportivo y gran turismo.',
      price: 189000,
      brand: 'McLaren',
      model: 'GT Black Edition',
      year: 2021,
      km: 31000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      location: 'Alicante',
      province: 'Alicante',
      sellerType: 'Private seller',
      bodyType: 'Coupe',
      doors: 2,
      powerCv: 620,
      engineSize: '4.0 V8',
      environmentalLabel: 'C',
      warranty: true,
      color: 'Black',
      registrationMonth: 2,
      registrationYear: 2021,
      previousOwners: 1,
      financeable: true,
      maintenanceBook: true,
    },
  },
  {
    user: { name: 'Pruebas 8', email: 'pruebas8@gmail.com', password: 'prueba88' },
    images: ['subaru_wrx.png', 'subaru_wrx1.png'],
    listing: {
      title: 'Subaru WRX STI',
      description: 'Subaru WRX STI con tracción total, configuración deportiva y muy buen estado general.',
      price: 36500,
      brand: 'Subaru',
      model: 'WRX STI',
      year: 2018,
      km: 79000,
      fuelType: 'Gasoline',
      transmission: 'Manual',
      location: 'Girona',
      province: 'Girona',
      sellerType: 'Private seller',
      bodyType: 'Sedan',
      doors: 4,
      powerCv: 300,
      engineSize: '2.5 Boxer',
      environmentalLabel: 'C',
      warranty: false,
      color: 'Blue',
      registrationMonth: 10,
      registrationYear: 2018,
      previousOwners: 2,
      financeable: true,
      maintenanceBook: true,
    },
  },
];

async function request(pathname, options = {}) {
  const response = await fetch(`${apiBaseUrl}${pathname}`, {
    headers: {
      Accept: 'application/json',
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || data?.error || `${response.status} ${response.statusText}`);
  }

  return data;
}

async function registerOrLogin(user) {
  try {
    await request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(user),
    });
    console.log(`Created user ${user.email}`);
  } catch (error) {
    console.log(`User ${user.email} already exists or could not be registered: ${error.message}`);
  }

  const login = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: user.email, password: user.password }),
  });

  return login.token;
}

async function createListing(listing, token) {
  return request('/api/cars', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(listing),
  });
}

async function uploadImage(listingId, imageFileName, token) {
  const filePath = path.join(carsDir, imageFileName);
  const buffer = await fs.readFile(filePath);
  const extension = path.extname(imageFileName).toLowerCase();
  const contentType = extension === '.webp' ? 'image/webp' : extension === '.jpg' || extension === '.jpeg' ? 'image/jpeg' : 'image/png';
  const blob = new Blob([buffer], { type: contentType });
  const formData = new FormData();
  formData.append('file', blob, imageFileName);

  return request(`/api/cars/${listingId}/images`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
}

async function main() {
  console.log(`Seeding demo listings into ${apiBaseUrl}`);

  for (const item of demoListings) {
    console.log(`\nProcessing ${item.listing.title}...`);
    const token = await registerOrLogin(item.user);
    const listing = await createListing(item.listing, token);
    console.log(`Created listing #${listing.id}: ${listing.title || item.listing.title}`);

    for (const image of item.images) {
      await uploadImage(listing.id, image, token);
      console.log(`Uploaded ${image}`);
    }
  }

  console.log('\nDone. Open /tabs/home to see the demo listings.');
}

main().catch((error) => {
  console.error('\nSeed failed:', error.message);
  process.exit(1);
});
