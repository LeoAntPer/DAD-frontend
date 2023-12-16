<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user.js'
import { ref } from 'vue'
import { useToast } from 'vue-toast-notification'

const toast = useToast()
const router = useRouter()
const userStore = useUserStore()

const codes = ref({
  current_code: '',
  code: '',
  code_confirmation: ''
})

const errors = ref(null)

const emit = defineEmits(['changedCode'])

const changeCode = async () => {
  try {
    console.log("Codes")
    console.log(codes.value)
    await userStore.changeConfirmationCode(codes.value)
    toast.success('Confirmation Code has been changed.')
    emit('changedCode')
    router.back()
  } catch (error) {
    if (error.response.status == 422) {
      errors.value = error.response.data.errors
      toast.error('Confirmation Code has not been changed due to validation errors!')
    } else {
      toast.error('Confirmation Code has not been changed due to unknown server error!')
    }
  }
}
</script>

<template>
  <form class="row g-3 needs-validation" novalidate @submit.prevent="changeCode">
    <h3 class="mt-5 mb-3">Change Confirmation Code</h3>
    <hr>
    <div class="mb-3">
      <div class="mb-3">
        <label for="inputCurrentPassword" class="form-label">Current Confirmation Code</label>
        <input type="password" class="form-control" id="inputCurrentPassword" required v-model="codes.current_code">
        <field-error-message :errors="errors" fieldName="current_password"></field-error-message>
      </div>
    </div>
    <div class="mb-3">
      <div class="mb-3">
        <label for="inputPassword" class="form-label">New Confirmation Code</label>
        <input type="password" class="form-control" id="inputPassword" required v-model="codes.code">
        <field-error-message :errors="errors" fieldName="password"></field-error-message>
      </div>
    </div>
    <div class="mb-3">
      <div class="mb-3">
        <label for="inputPasswordConfirm" class="form-label">Confirmation Code Confirmation</label>
        <input type="password" class="form-control" id="inputPasswordConfirm" required v-model="codes.code_confirmation">
        <field-error-message :errors="errors" fieldName="password_confirmation"></field-error-message>
      </div>
    </div>
    <div class="mb-3 d-flex justify-content-center">
      <button type="button" class="btn btn-primary px-5" @click="changeCode">Change Confirmation Code</button>
    </div>
  </form>
</template>

