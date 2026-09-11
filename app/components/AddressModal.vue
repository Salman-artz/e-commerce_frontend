<template>
  <AppModal :modelValue="modelValue" @update:modelValue="$emit('update:modelValue', $event)">
    <div class="mb-6">
      <h3 class="text-lg font-bold text-gray-900">{{ editData ? 'Ubah Alamat' : 'Tambah Alamat Baru' }}</h3>
      <p class="text-sm text-gray-500">Masukkan detail alamat pengiriman Anda.</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <AppInput
        v-model="form.recipientName"
        label="Nama Penerima"
        placeholder="Contoh: Budi Santoso"
        :error="errors.recipientName"
      />
      <AppInput
        v-model="form.phone"
        label="Nomor Telepon"
        placeholder="Contoh: 081234567890"
        :error="errors.phone"
      />
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Provinsi</label>
          <select
            v-model="form.provinceId"
            @change="fetchCities"
            class="block w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-[#18181B] focus:outline-none focus:ring-1 focus:ring-[#18181B]"
          >
            <option value="">Pilih Provinsi</option>
            <option v-for="prov in provinces" :key="prov.province_id" :value="prov.province_id">
              {{ prov.province }}
            </option>
          </select>
          <p v-if="errors.provinceId" class="mt-1 text-xs text-red-500">{{ errors.provinceId }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Kota/Kabupaten</label>
          <select
            v-model="form.cityId"
            :disabled="!cities.length"
            class="block w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-[#18181B] focus:outline-none focus:ring-1 focus:ring-[#18181B] disabled:bg-gray-100"
          >
            <option value="">Pilih Kota</option>
            <option v-for="city in cities" :key="city.city_id" :value="city.city_id">
              {{ city.type }} {{ city.city_name }}
            </option>
          </select>
          <p v-if="errors.cityId" class="mt-1 text-xs text-red-500">{{ errors.cityId }}</p>
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <AppInput
          v-model="form.kecamatan"
          label="Kecamatan"
          placeholder="Contoh: Sukun"
          :error="errors.kecamatan"
        />
        <AppInput
          v-model="form.kelurahan"
          label="Kelurahan/Desa"
          placeholder="Contoh: Bandungrejosari"
          :error="errors.kelurahan"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Detail Alamat (Jalan, RT/RW, Patokan)</label>
        <textarea
          v-model="form.detailAddress"
          rows="3"
          placeholder="Contoh: Jl. Merdeka No. 45, RT 01/RW 02, Dekat warung pak kumis"
          class="block w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#18181B] focus:outline-none focus:ring-1 focus:ring-[#18181B] transition-colors"
          :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': errors.detailAddress }"
        ></textarea>
        <p v-if="errors.detailAddress" class="mt-1 text-xs text-red-500">{{ errors.detailAddress }}</p>
      </div>
      
      <div class="mt-8 flex justify-end gap-3">
        <AppButton type="button" variant="ghost" @click="$emit('update:modelValue', false)">
          Batal
        </AppButton>
        <AppButton type="submit" :loading="loading">
          Simpan Alamat
        </AppButton>
      </div>
    </form>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  editData: {
    type: Object as () => any | null,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'saved'])

const { api } = useApi()
const loading = ref(false)

const provinces = ref<any[]>([])
const cities = ref<any[]>([])

onMounted(async () => {
  try {
    const res = await $fetch('/api/rajaongkir/provinces')
    provinces.value = res.rajaongkir.results
  } catch (error) {
    console.error('Failed to fetch provinces', error)
  }
})

const fetchCities = async (initialCityId?: string) => {
  if (!initialCityId) form.cityId = ''
  cities.value = []
  if (!form.provinceId) return
  
  try {
    const res = await $fetch(`/api/rajaongkir/cities?province=${form.provinceId}`)
    cities.value = res.rajaongkir.results
    if (initialCityId) {
      form.cityId = initialCityId
    }
  } catch (error) {
    console.error('Failed to fetch cities', error)
  }
}

import { watch } from 'vue'

watch(() => props.modelValue, (isOpen) => {
  if (isOpen && props.editData) {
    form.recipientName = props.editData.recipientName || ''
    form.phone = props.editData.phone || ''
    // We can't parse fullAddress easily, so we just populate detailAddress with it and let them fix it
    form.detailAddress = props.editData.fullAddress || ''
    form.provinceId = ''
    form.cityId = ''
    form.kecamatan = ''
    form.kelurahan = ''
  } else if (!isOpen) {
    // Reset when closed
    Object.keys(form).forEach(k => (form as any)[k] = '')
    Object.keys(errors).forEach(k => (errors as any)[k] = '')
  }
})


const form = reactive({
  recipientName: '',
  phone: '',
  provinceId: '',
  cityId: '',
  kecamatan: '',
  kelurahan: '',
  detailAddress: ''
})

const errors = reactive({
  recipientName: '',
  phone: '',
  provinceId: '',
  cityId: '',
  kecamatan: '',
  kelurahan: '',
  detailAddress: ''
})

const validate = () => {
  let isValid = true
  Object.keys(errors).forEach(key => (errors as any)[key] = '')

  if (!form.recipientName || form.recipientName.length < 2) {
    errors.recipientName = 'Nama penerima minimal 2 karakter'
    isValid = false
  }
  if (!form.phone || form.phone.length < 8) {
    errors.phone = 'Nomor telepon minimal 8 karakter'
    isValid = false
  }
  if (!form.provinceId) {
    errors.provinceId = 'Silakan pilih provinsi'
    isValid = false
  }
  if (!form.cityId) {
    errors.cityId = 'Silakan pilih kota/kabupaten'
    isValid = false
  }
  if (!form.kecamatan) {
    errors.kecamatan = 'Kecamatan harus diisi'
    isValid = false
  }
  if (!form.kelurahan) {
    errors.kelurahan = 'Kelurahan/Desa harus diisi'
    isValid = false
  }
  if (!form.detailAddress || form.detailAddress.length < 5) {
    errors.detailAddress = 'Detail alamat minimal 5 karakter'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validate()) return

  loading.value = true
  try {
    const provName = provinces.value.find(p => p.province_id === form.provinceId)?.province || ''
    const city = cities.value.find(c => c.city_id === form.cityId)
    const cityName = city ? `${city.type} ${city.city_name}` : ''

    const combinedAddress = `${form.detailAddress}, Kelurahan ${form.kelurahan}, Kecamatan ${form.kecamatan}, ${cityName}, Provinsi ${provName}`

    const payload = {
      recipientName: form.recipientName,
      phone: form.phone,
      fullAddress: combinedAddress,
      cityId: form.cityId
    }

    if (props.editData && props.editData.id) {
      await api.patch(`/addresses/${props.editData.id}`, payload)
    } else {
      await api.post('/addresses', payload)
    }
    
    // Reset form
    form.recipientName = ''
    form.phone = ''
    form.provinceId = ''
    form.cityId = ''
    form.kecamatan = ''
    form.kelurahan = ''
    form.detailAddress = ''
    
    emit('saved')
    emit('update:modelValue', false)
  } catch (err: any) {
    console.error('Failed to save address', err)
    alert(err?.data?.message || 'Gagal menyimpan alamat')
  } finally {
    loading.value = false
  }
}
</script>
