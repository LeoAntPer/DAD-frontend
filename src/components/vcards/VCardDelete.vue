<script setup>
import { ref, inject } from 'vue'
import { useUserStore } from '../../stores/user';
//import { useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'

const toast = useToast()
const axios = inject('axios')
//const router = useRouter()

const userStore = useUserStore()

const credentials = ref({
      password: '',
      code: ''
})

const deleteVCard = async () => {
  try {
    console.log("Credentials")
    console.log(credentials.value)
    const response = await axios.delete('vcards/' + userStore.userId, {params: {password: credentials.value.password, code: credentials.value.code}})
    const vcard = response.data.data
    console.log(vcard)
    toast.success('VCard' + userStore.userId + 'was deleted!')
    userStore.logout()
  } catch(error) {
    console.log(error)
    credentials.value.password = ''
    credentials.value.code = ''
    toast.error('User credentials are invalid!')
  }
}

</script>

<template>
  <form class="row g-3 needs-validation" novalidate @submit.prevent="deleteVCard">
    <h3 class="mt-5 mb-3">Delete VCard</h3>
    <hr>

    <div class="mb-3">
      <div class="mb-3">
        <label for="inputPassword" class="form-label">Password</label>
        <input type="password" class="form-control" id="inputPassword" required v-model="credentials.password">
      </div>
    </div>

    <div class="mb-3">
        <div class="mb-3">
          <label for="inputCode" class="form-label">Confirmation Code</label>
          <input type="text" class="form-control" id="inputCode" required v-model="credentials.code">
        </div>
      </div>

    <div class="mb-3 d-flex justify-content-center">
      <button type="button" class="btn btn-danger px-5" @click="deleteVCard"><i class="bi bi-trash"></i>&nbsp;Delete</button>
    </div>
  </form>
</template>

