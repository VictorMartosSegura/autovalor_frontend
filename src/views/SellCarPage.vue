<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title>Vender coche</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="sell-content ion-padding">
      <section class="intro-card">
        <h2>Publica tu coche con IA</h2>
        <p>Sube fotos del vehículo. AutoValor intentará rellenar la plantilla del anuncio. Después podrás editar todo antes de publicarlo.</p>
      </section>

      <section class="step-card">
        <div class="step-header">
          <h3>1. Fotos del vehículo</h3>
          <span>{{ selectedFiles.length }}/{{ maxImages }}</span>
        </div>
        <p class="muted">Recomendado: exterior, interior, frontal, trasera, lateral y salpicadero/kilómetros.</p>

        <label class="upload-box">
          <input type="file" accept="image/*" multiple @change="handleFiles" />
          <ion-icon :icon="cloudUploadOutline" />
          <strong>Seleccionar fotos</strong>
          <small>Máximo {{ maxImages }} imágenes</small>
        </label>

        <div v-if="previews.length" class="preview-grid">
          <div v-for="(preview, index) in previews" :key="preview.url" class="preview-item">
            <img :src="preview.url" :alt="`Foto ${index + 1}`" />
            <button type="button" @click="removeImage(index)">
              <ion-icon :icon="close" />
            </button>
          </div>
        </div>
      </section>

      <section class="step-card">
        <h3>2. Prompt opcional</h3>
        <ion-textarea
          v-model="prompt"
          placeholder="Ejemplo: Es un BMW Serie 3 de 2018, diesel, manual. Revisa matrícula, estado e interior si se ven en las fotos."
          auto-grow
          class="text-area"
        />
        <ion-button expand="block" :disabled="aiLoading || selectedFiles.length === 0" @click="generateSuggestion">
          <ion-spinner v-if="aiLoading" name="crescent" />
          <span v-else>Rellenar con IA</span>
        </ion-button>
        <p v-if="aiMessage" class="info-message">{{ aiMessage }}</p>
      </section>

      <section class="step-card">
        <div class="step-header">
          <h3>3. Revisa y edita el anuncio</h3>
          <span v-if="confidenceText">IA: {{ confidenceText }}</span>
        </div>

        <div v-if="warnings.length" class="warnings">
          <strong>Avisos de la IA</strong>
          <ul>
            <li v-for="warning in warnings" :key="warning">{{ warning }}</li>
          </ul>
        </div>

        <div class="form-grid">
          <ion-input v-model="form.title" label="Título" label-placement="stacked" fill="outline" />
          <ion-input v-model="form.brand" label="Marca" label-placement="stacked" fill="outline" />
          <ion-input v-model="form.model" label="Modelo" label-placement="stacked" fill="outline" />
          <ion-input v-model.number="form.year" type="number" label="Año" label-placement="stacked" fill="outline" />
          <ion-input v-model.number="form.km" type="number" label="Kilómetros" label-placement="stacked" fill="outline" />
          <ion-input v-model.number="form.price" type="number" label="Precio (€)" label-placement="stacked" fill="outline" />
          <ion-input v-model="form.fuelType" label="Combustible" label-placement="stacked" fill="outline" />
          <ion-input v-model="form.transmission" label="Cambio" label-placement="stacked" fill="outline" />
          <ion-input v-model="form.location" label="Localidad" label-placement="stacked" fill="outline" />
          <ion-input v-model="form.province" label="Provincia" label-placement="stacked" fill="outline" />
          <ion-input v-model="form.bodyType" label="Carrocería" label-placement="stacked" fill="outline" />
          <ion-input v-model="form.color" label="Color" label-placement="stacked" fill="outline" />
          <ion-input v-model.number="form.doors" type="number" label="Puertas" label-placement="stacked" fill="outline" />
          <ion-input v-model.number="form.powerCv" type="number" label="Potencia CV" label-placement="stacked" fill="outline" />
          <ion-input v-model="form.engineSize" label="Motor" label-placement="stacked" fill="outline" />
          <ion-input v-model="form.environmentalLabel" label="Etiqueta ambiental" label-placement="stacked" fill="outline" />
        </div>

        <ion-textarea v-model="form.description" label="Descripción" label-placement="stacked" fill="outline" auto-grow class="description-area" />

        <div class="toggles">
          <ion-toggle v-model="form.warranty">Garantía</ion-toggle>
          <ion-toggle v-model="form.financeable">Financiable</ion-toggle>
          <ion-toggle v-model="form.maintenanceBook">Libro mantenimiento</ion-toggle>
        </div>
      </section>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>

      <ion-button expand="block" class="publish-btn" :disabled="publishing" @click="publishListing">
        <ion-spinner v-if="publishing" name="crescent" />
        <span v-else>Publicar anuncio</span>
      </ion-button>
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
  IonTitle,
  IonToggle,
  IonToolbar,
} from '@ionic/vue';
import { close, cloudUploadOutline } from 'ionicons/icons';
import { computed, onBeforeUnmount, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { listingService, type CreateListingRequest } from '@/services/listingService';
import { vehicleAiService } from '@/services/vehicleAiService';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const auth = useAuthStore();
const maxImages = 6;

const selectedFiles = ref<File[]>([]);
const previews = ref<{ file: File; url: string }[]>([]);
const prompt = ref('');
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
  sellerType: 'Particular',
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

const confidenceText = computed(() => {
  if (confidence.value === null || confidence.value === undefined) return '';
  return `${Math.round(confidence.value * 100)}%`;
});

onBeforeUnmount(() => {
  previews.value.forEach((preview) => URL.revokeObjectURL(preview.url));
});

function handleFiles(event: Event) {
  errorMessage.value = '';
  const input = event.target as HTMLInputElement;
  const files = Array.from(input.files || []).filter((file) => file.type.startsWith('image/'));
  const merged = [...selectedFiles.value, ...files].slice(0, maxImages);

  if (selectedFiles.value.length + files.length > maxImages) {
    errorMessage.value = `Solo puedes subir un máximo de ${maxImages} fotos.`;
  }

  previews.value.forEach((preview) => URL.revokeObjectURL(preview.url));
  selectedFiles.value = merged;
  previews.value = merged.map((file) => ({ file, url: URL.createObjectURL(file) }));
  input.value = '';
}

function removeImage(index: number) {
  URL.revokeObjectURL(previews.value[index].url);
  selectedFiles.value.splice(index, 1);
  previews.value.splice(index, 1);
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

  if (!selectedFiles.value.length) {
    errorMessage.value = 'Sube al menos una foto del vehículo.';
    return;
  }

  aiLoading.value = true;
  try {
    const suggestion = await vehicleAiService.suggest(prompt.value, selectedFiles.value, auth.token);
    applySuggestion(suggestion);
    aiMessage.value = 'La IA ha rellenado la plantilla. Revisa los datos antes de publicar.';
  } catch (error: any) {
    errorMessage.value = error?.message || 'No se pudo generar la sugerencia con IA.';
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
  if (!form.title.trim()) return 'El título es obligatorio.';
  if (!form.brand.trim()) return 'La marca es obligatoria.';
  if (!form.model.trim()) return 'El modelo es obligatorio.';
  if (!form.year || form.year < 1900) return 'El año no es válido.';
  if (form.km === null || form.km === undefined || form.km < 0) return 'Los kilómetros no son válidos.';
  if (!form.price || form.price < 0) return 'El precio no es válido.';
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

    for (const file of selectedFiles.value) {
      await listingService.uploadImage(created.id, file, auth.token);
    }

    successMessage.value = 'Anuncio publicado correctamente.';
    router.push(`/car/${created.id}`);
  } catch (error: any) {
    errorMessage.value = error?.message || 'No se pudo publicar el anuncio.';
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
.sell-content {
  --background: #ffffff;
}

.intro-card,
.step-card {
  background: #f6f6f7;
  border-radius: 20px;
  padding: 18px;
  margin-bottom: 16px;
}

.intro-card h2,
.step-card h3 {
  margin: 0 0 8px;
  color: #202127;
}

.intro-card p,
.muted {
  margin: 0;
  color: #626873;
  line-height: 1.45;
}

.step-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.upload-box {
  margin-top: 14px;
  min-height: 124px;
  border: 2px dashed #c7c9cf;
  border-radius: 18px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
}

.upload-box input {
  display: none;
}

.upload-box ion-icon {
  font-size: 30px;
  color: #202127;
}

.upload-box small {
  color: #7a7f88;
}

.preview-grid {
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.preview-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 14px;
  overflow: hidden;
  background: #ffffff;
}

.preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-item button {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border: 0;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.68);
  color: #fff;
  display: grid;
  place-items: center;
}

.text-area,
.description-area {
  margin: 10px 0 14px;
  --background: #ffffff;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-top: 12px;
}

.toggles {
  display: grid;
  gap: 10px;
  margin-top: 10px;
}

.warnings {
  background: #fff8e6;
  border: 1px solid #f2d28b;
  color: #7a5600;
  border-radius: 14px;
  padding: 12px;
  margin-top: 10px;
}

.warnings ul {
  margin: 8px 0 0;
  padding-left: 18px;
}

.info-message,
.success-message {
  color: #027a48;
  margin: 10px 0 0;
}

.error-message {
  color: #d92d20;
  margin: 12px 0;
}

.publish-btn {
  --background: #101114;
  --border-radius: 999px;
  min-height: 52px;
  margin-bottom: 24px;
}

@media (min-width: 768px) {
  .sell-content {
    max-width: 860px;
    margin: 0 auto;
  }

  .form-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
