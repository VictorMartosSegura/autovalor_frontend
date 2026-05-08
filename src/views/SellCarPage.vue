<template>
  <ion-page>
    <ion-header class="ion-no-border sell-header mobile-safe-header">
      <ion-toolbar>
        <div class="topbar">
          <button v-if="step === 'review'" type="button" class="round-icon-btn" @click="goBackToPhotos">
            <ion-icon :icon="arrowBack" />
          </button>
          <div>
            <h1>{{ step === 'photos' ? 'Sell your car' : 'Review listing' }}</h1>
            <p>{{ step === 'photos' ? 'Follow the photo guide so AutoValor can fill the listing.' : 'Check the details before publishing.' }}</p>
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="sell-content mobile-safe-content">
      <section v-if="step === 'photos'" class="screen-block">
        <div class="hero-card">
          <div class="hero-icon">
            <ion-icon :icon="sparklesOutline" />
          </div>
          <h2>AI vehicle scan</h2>
          <p>Upload the photos in the suggested order. AutoValor will use them to detect the vehicle and prepare the listing template.</p>
        </div>

        <div class="upload-card">
          <div class="section-heading">
            <div>
              <h3>Photo guide</h3>
              <p>{{ uploadedFiles.length }}/{{ maxImages }} selected</p>
            </div>
          </div>

          <div class="photo-slots-grid">
            <label v-for="(slot, index) in photoSlots" :key="slot.key" class="photo-slot" :class="{ filled: Boolean(previews[index]) }">
              <input type="file" accept="image/*" @change="handleSlotFile($event, index)" />

              <img v-if="previews[index]" :src="previews[index]?.url" :alt="slot.title" />

              <div v-else class="slot-empty-state">
                <ion-icon :icon="slot.icon" />
                <strong>{{ slot.title }}</strong>
                <small>{{ slot.description }}</small>
              </div>

              <button v-if="previews[index]" type="button" class="remove-photo-btn" @click.prevent="removeImage(index)">
                <ion-icon :icon="close" />
              </button>
            </label>
          </div>
        </div>

        <div class="tips-card">
          <h3>Tips for better AI results</h3>
          <ul>
            <li>Use clear photos with good light.</li>
            <li>Include the dashboard if mileage is visible.</li>
            <li>Add an engine or document photo only if it helps identify the vehicle.</li>
          </ul>
        </div>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p v-if="aiMessage" class="success-message">{{ aiMessage }}</p>

        <ion-button expand="block" class="primary-btn" :disabled="aiLoading || uploadedFiles.length === 0" @click="generateSuggestion">
          <ion-spinner v-if="aiLoading" name="crescent" />
          <span v-else>Analyze vehicle</span>
        </ion-button>
      </section>

      <section v-else class="screen-block">
        <div class="review-card">
          <div class="review-title-row">
            <div>
              <h2>{{ form.title || 'Vehicle listing' }}</h2>
              <p>{{ form.brand }} {{ form.model }}<span v-if="form.year"> · {{ form.year }}</span></p>
            </div>
            <span v-if="confidenceText" class="confidence-pill">AI {{ confidenceText }}</span>
          </div>

          <div v-if="uploadedPreviews.length" class="mini-gallery">
            <img v-for="preview in uploadedPreviews.slice(0, 3)" :key="preview.url" :src="preview.url" alt="Selected vehicle photo" />
            <div v-if="uploadedPreviews.length > 3" class="more-photos">+{{ uploadedPreviews.length - 3 }}</div>
          </div>
        </div>

        <div v-if="warnings.length" class="warnings">
          <strong>AI notes</strong>
          <ul>
            <li v-for="warning in warnings" :key="warning">{{ warning }}</li>
          </ul>
        </div>

        <div class="form-card">
          <h3>Basic information</h3>
          <div class="form-grid">
            <ion-input v-model="form.title" label="Title" label-placement="stacked" fill="outline" />
            <ion-input v-model="form.brand" label="Brand" label-placement="stacked" fill="outline" />
            <ion-input v-model="form.model" label="Model" label-placement="stacked" fill="outline" />
            <ion-input v-model.number="form.year" type="number" label="Year" label-placement="stacked" fill="outline" />
            <ion-input v-model.number="form.km" type="number" label="Mileage" label-placement="stacked" fill="outline" />
            <ion-input v-model.number="form.price" type="number" label="Price (€)" label-placement="stacked" fill="outline" />
          </div>
        </div>

        <div class="form-card">
          <h3>Details</h3>
          <div class="form-grid">
            <ion-input v-model="form.fuelType" label="Fuel" label-placement="stacked" fill="outline" />
            <ion-input v-model="form.transmission" label="Transmission" label-placement="stacked" fill="outline" />
            <ion-input v-model="form.location" label="City" label-placement="stacked" fill="outline" />
            <ion-input v-model="form.province" label="Province" label-placement="stacked" fill="outline" />
            <ion-input v-model="form.bodyType" label="Body type" label-placement="stacked" fill="outline" />
            <ion-input v-model="form.color" label="Color" label-placement="stacked" fill="outline" />
            <ion-input v-model.number="form.doors" type="number" label="Doors" label-placement="stacked" fill="outline" />
            <ion-input v-model.number="form.powerCv" type="number" label="Power CV" label-placement="stacked" fill="outline" />
            <ion-input v-model="form.engineSize" label="Engine" label-placement="stacked" fill="outline" />
            <ion-input v-model="form.environmentalLabel" label="Eco label" label-placement="stacked" fill="outline" />
          </div>
        </div>

        <div class="form-card">
          <h3>Description</h3>
          <ion-textarea v-model="form.description" label="Description" label-placement="stacked" fill="outline" auto-grow class="description-area" />
          <div class="toggles">
            <ion-toggle v-model="form.warranty">Warranty</ion-toggle>
            <ion-toggle v-model="form.financeable">Financeable</ion-toggle>
            <ion-toggle v-model="form.maintenanceBook">Service book</ion-toggle>
          </div>
        </div>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>

        <div class="bottom-actions">
          <ion-button expand="block" fill="outline" class="secondary-btn" :disabled="publishing" @click="goBackToPhotos">Edit photos</ion-button>
          <ion-button expand="block" class="primary-btn" :disabled="publishing" @click="publishListing">
            <ion-spinner v-if="publishing" name="crescent" />
            <span v-else>Publish listing</span>
          </ion-button>
        </div>
      </section>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonPage,
  IonSpinner,
  IonTextarea,
  IonToggle,
  IonToolbar,
} from '@ionic/vue';
import {
  arrowBack,
  cameraOutline,
  carSportOutline,
  close,
  documentTextOutline,
  speedometerOutline,
  sparklesOutline,
} from 'ionicons/icons';
import { computed, onBeforeUnmount, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { listingService, type CreateListingRequest } from '@/services/listingService';
import { vehicleAiService } from '@/services/vehicleAiService';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const auth = useAuthStore();
const maxImages = 6;

const photoSlots = [
  { key: 'front', title: 'Front', description: 'Main exterior photo', icon: carSportOutline },
  { key: 'rear', title: 'Rear', description: 'Back of the vehicle', icon: carSportOutline },
  { key: 'side', title: 'Side', description: 'Full side profile', icon: carSportOutline },
  { key: 'interior', title: 'Interior', description: 'Seats and cabin', icon: cameraOutline },
  { key: 'dashboard', title: 'Dashboard', description: 'Mileage if visible', icon: speedometerOutline },
  { key: 'extra', title: 'Engine / Extra', description: 'Engine or documents', icon: documentTextOutline },
];

const step = ref<'photos' | 'review'>('photos');
const selectedFiles = ref<Array<File | null>>(Array(maxImages).fill(null));
const previews = ref<Array<{ file: File; url: string } | null>>(Array(maxImages).fill(null));
const aiLoading = ref(false);
const publishing = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const aiMessage = ref('');
const warnings = ref<string[]>([]);
const confidence = ref<number | null>(null);

const form = reactive<CreateListingRequest>({
  title: '',
  description: '',
  price: 0,
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  km: 0,
  fuelType: '',
  transmission: '',
  location: '',
  province: '',
  sellerType: 'Private seller',
  bodyType: '',
  doors: null,
  powerCv: null,
  engineSize: '',
  environmentalLabel: '',
  warranty: false,
  color: '',
  registrationMonth: null,
  registrationYear: null,
  previousOwners: null,
  financeable: false,
  maintenanceBook: false,
});

const uploadedFiles = computed(() => selectedFiles.value.filter((file): file is File => Boolean(file)));
const uploadedPreviews = computed(() => previews.value.filter((preview): preview is { file: File; url: string } => Boolean(preview)));

const confidenceText = computed(() => {
  if (confidence.value === null || confidence.value === undefined) return '';
  return `${Math.round(confidence.value * 100)}%`;
});

onBeforeUnmount(() => {
  previews.value.forEach((preview) => {
    if (preview) URL.revokeObjectURL(preview.url);
  });
});

function handleSlotFile(event: Event, index: number) {
  errorMessage.value = '';
  aiMessage.value = '';
  const input = event.target as HTMLInputElement;
  const file = Array.from(input.files || []).find((candidate) => candidate.type.startsWith('image/'));

  if (!file) {
    input.value = '';
    return;
  }

  if (previews.value[index]) {
    URL.revokeObjectURL(previews.value[index]!.url);
  }

  selectedFiles.value[index] = file;
  previews.value[index] = { file, url: URL.createObjectURL(file) };
  input.value = '';
}

function removeImage(index: number) {
  if (previews.value[index]) {
    URL.revokeObjectURL(previews.value[index]!.url);
  }
  selectedFiles.value[index] = null;
  previews.value[index] = null;
}

function goBackToPhotos() {
  step.value = 'photos';
  errorMessage.value = '';
  successMessage.value = '';
}

function buildVehiclePrompt() {
  return `AutoValor is creating a vehicle marketplace listing. The uploaded photos follow this order when present: 1 Front exterior, 2 Rear exterior, 3 Side profile, 4 Interior/cabin, 5 Dashboard or mileage, 6 Engine, documents or extra detail. Analyze only what is visible. The vehicle may be a car, motorbike, van or similar road vehicle. Fill the listing template with title, description and technical fields. Do not invent data. If a field is not visible or cannot be inferred safely, return null and add a warning.`;
}

async function generateSuggestion() {
  await auth.init();
  errorMessage.value = '';
  successMessage.value = '';
  aiMessage.value = '';

  if (!auth.token) {
    router.push({ path: '/signin', query: { redirect: '/tabs/sell' } });
    return;
  }

  if (!uploadedFiles.value.length) {
    errorMessage.value = 'Upload at least one vehicle photo.';
    return;
  }

  aiLoading.value = true;
  try {
    const suggestion = await vehicleAiService.suggest(buildVehiclePrompt(), uploadedFiles.value, auth.token);
    applySuggestion(suggestion);
    step.value = 'review';
  } catch (error: any) {
    errorMessage.value = error?.message || 'Could not analyze the vehicle.';
  } finally {
    aiLoading.value = false;
  }
}

function applySuggestion(suggestion: any) {
  const keys: Array<keyof CreateListingRequest> = [
    'title', 'description', 'brand', 'model', 'year', 'km', 'fuelType', 'transmission', 'location', 'province', 'sellerType',
    'bodyType', 'doors', 'powerCv', 'engineSize', 'environmentalLabel', 'warranty', 'color', 'registrationMonth',
    'registrationYear', 'previousOwners', 'financeable', 'maintenanceBook',
  ];

  keys.forEach((key) => {
    const value = suggestion[key];
    if (value !== undefined && value !== null && value !== '') {
      (form as any)[key] = value;
    }
  });

  confidence.value = suggestion.confidence ?? null;
  warnings.value = suggestion.warnings || [];

  if (!form.title && form.brand && form.model) {
    form.title = `${form.brand} ${form.model} ${form.year || ''}`.trim();
  }
}

function validateForm() {
  if (!form.title.trim()) return 'Title is required.';
  if (!form.brand.trim()) return 'Brand is required.';
  if (!form.model.trim()) return 'Model is required.';
  if (!form.year || form.year < 1900) return 'Year is not valid.';
  if (form.km === null || form.km === undefined || form.km < 0) return 'Mileage is not valid.';
  if (!form.price || form.price < 0) return 'Price is not valid.';
  return '';
}

async function publishListing() {
  await auth.init();
  errorMessage.value = '';
  successMessage.value = '';

  if (!auth.token) {
    router.push({ path: '/signin', query: { redirect: '/tabs/sell' } });
    return;
  }

  const validationError = validateForm();
  if (validationError) {
    errorMessage.value = validationError;
    return;
  }

  publishing.value = true;
  try {
    const created = await listingService.create(cleanPayload(form), auth.token);

    for (const file of uploadedFiles.value) {
      await listingService.uploadImage(created.id, file, auth.token);
    }

    successMessage.value = 'Listing published successfully.';
    router.push(`/car/${created.id}`);
  } catch (error: any) {
    errorMessage.value = error?.message || 'Could not publish the listing.';
  } finally {
    publishing.value = false;
  }
}

function cleanPayload(payload: CreateListingRequest): CreateListingRequest {
  const copy: any = { ...payload };
  Object.keys(copy).forEach((key) => {
    if (copy[key] === '' || copy[key] === null || copy[key] === undefined) {
      delete copy[key];
    }
  });
  return copy;
}
</script>

<style scoped>
.sell-header,
.sell-header ion-toolbar {
  --background: #ffffff;
  --border-width: 0;
}

.topbar {
  padding: 16px var(--app-page-gutter) 8px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.topbar h1 {
  margin: 0;
  color: #1f222a;
  font-size: 26px;
  line-height: 1.15;
  font-weight: 800;
}

.topbar p {
  margin: 4px 0 0;
  color: #8b8e96;
  font-size: 13px;
  line-height: 1.35;
}

.round-icon-btn {
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 999px;
  background: #f4f5f7;
  color: #1f222a;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.sell-content {
  --background: #ffffff;
}

.screen-block {
  padding: 12px var(--app-page-gutter) 28px;
}

.hero-card,
.upload-card,
.tips-card,
.review-card,
.form-card,
.warnings {
  background: #f6f6f7;
  border-radius: 22px;
  padding: 18px;
  margin-bottom: 14px;
}

.hero-card {
  text-align: left;
}

.hero-icon {
  width: 50px;
  height: 50px;
  border-radius: 16px;
  background: #ffffff;
  color: #1f222a;
  display: grid;
  place-items: center;
  margin-bottom: 14px;
}

.hero-icon ion-icon {
  font-size: 24px;
}

.hero-card h2,
.review-card h2,
.form-card h3,
.upload-card h3,
.tips-card h3 {
  margin: 0;
  color: #1f222a;
  font-weight: 800;
}

.hero-card h2,
.review-card h2 {
  font-size: 22px;
}

.upload-card h3,
.tips-card h3,
.form-card h3 {
  font-size: 18px;
}

.hero-card p,
.section-heading p,
.review-title-row p {
  margin: 6px 0 0;
  color: #7d8088;
  font-size: 14px;
  line-height: 1.45;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.photo-slots-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.photo-slot {
  position: relative;
  min-height: 132px;
  border: 2px dashed #d6d8dd;
  border-radius: 18px;
  background: #ffffff;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.photo-slot.filled {
  border-style: solid;
  border-color: transparent;
}

.photo-slot input {
  display: none;
}

.photo-slot > img {
  width: 100%;
  height: 100%;
  min-height: 132px;
  object-fit: cover;
}

.slot-empty-state {
  padding: 12px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.slot-empty-state ion-icon {
  font-size: 28px;
  color: #1f222a;
}

.slot-empty-state strong {
  color: #1f222a;
  font-size: 14px;
  font-weight: 800;
}

.slot-empty-state small {
  color: #8b8e96;
  font-size: 11px;
  line-height: 1.25;
}

.remove-photo-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 26px;
  height: 26px;
  border: 0;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.68);
  color: #ffffff;
  display: grid;
  place-items: center;
}

.tips-card ul {
  margin: 10px 0 0;
  padding-left: 18px;
  color: #7d8088;
  font-size: 14px;
  line-height: 1.45;
}

.description-area {
  margin-top: 12px;
  --background: #ffffff;
  --border-radius: 16px;
}

.review-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.confidence-pill {
  background: #ffffff;
  color: #1f222a;
  border-radius: 999px;
  padding: 7px 10px;
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;
}

.mini-gallery {
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  height: 72px;
}

.mini-gallery img,
.more-photos {
  border-radius: 14px;
  overflow: hidden;
  background: #ffffff;
}

.mini-gallery img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.more-photos {
  display: grid;
  place-items: center;
  color: #1f222a;
  font-weight: 800;
}

.warnings {
  background: #fff8e6;
  border: 1px solid #f2d28b;
  color: #7a5600;
}

.warnings ul {
  margin: 8px 0 0;
  padding-left: 18px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-top: 14px;
}

.form-grid ion-input,
.description-area {
  --background: #ffffff;
  --border-color: transparent;
  --border-radius: 16px;
  --highlight-color-focused: #1f222a;
}

.toggles {
  display: grid;
  gap: 10px;
  margin-top: 14px;
  color: #1f222a;
  font-weight: 600;
}

.error-message,
.success-message {
  margin: 12px 2px;
  font-size: 14px;
  line-height: 1.4;
}

.error-message {
  color: #d92d20;
}

.success-message {
  color: #027a48;
}

.primary-btn,
.secondary-btn {
  min-height: 54px;
  text-transform: none;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0;
  --border-radius: 999px;
  --box-shadow: none;
}

.primary-btn {
  --background: #3b3b3f;
  --color: #ffffff;
}

.secondary-btn {
  --color: #1f222a;
  --border-color: #d9dbe0;
}

.bottom-actions {
  display: grid;
  gap: 10px;
  margin-top: 4px;
}

@media (min-width: 768px) {
  .screen-block {
    max-width: 760px;
    margin: 0 auto;
  }

  .form-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
