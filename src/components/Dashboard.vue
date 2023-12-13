<script setup>
import { inject, ref, watch } from 'vue'
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router'

const axios = inject('axios')
const router = useRouter()
const userStore = useUserStore()

const user = ref(null)

const setupTransfer = () => {
  router.push({ name: '' })
}

const loadUser = async (id) => {
  if(userStore.userType == 'V') {
    try{
    const response = await axios.get('/vcards/' + id)
    user.value = response.data.data
    console.log(user.value)
    }catch(error) {
      console.log(error)
    }
  }
}

watch(
  () => userStore.userId,
  (newId) => {
    if(newId != -1) {
      loadUser(newId)
    }
  },
  { immediate: true }
)
</script>

<template>
  <div v-if="!userStore.user">
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 class="h2">Dashboard</h1>
    </div>
    <div>
      <h4>Some content</h4>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur, minus. Voluptatum cum iusto, commodi sunt molestias beatae adipisci architecto aspernatur, molestiae dicta placeat earum fugiat consequatur. Cum reiciendis ex amet!</p>
    </div>
    <div>
      <h4>Icons</h4>
      <p>Icons used for this template: <a href="https://icons.getbootstrap.com/"><strong>Bootstrap Icons</strong></a></p>
    </div>
  </div>
  <div v-if="userStore.userId != -1 && userStore.userType == 'V'">
    <h3>VCard {{ userStore.userId }}</h3>
    <hr>
    <div class="text-center">
      <h3>Balance:</h3>
      <h3 v-if="user">{{ user.balance }}€</h3>
      <button type="button" class="btn btn-primary px-4" @click="setupTransfer">Transfer Money</button>
    </div>
    <hr>
    <div>
      <h3>Latest Transactions</h3>
    </div>
  </div>
</template>
  