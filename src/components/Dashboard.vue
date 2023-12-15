<script setup>
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router'
const router = useRouter()
const userStore = useUserStore()

const newTransaction = () => {
  router.push({ name: 'NewTransaction' })
}
</script>

<template>
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
    <button v-if="userStore.userType == 'A'" type="button" class="btn btn-success px-4 btn-addprj" @click="newTransaction">
        <i class="bi bi-xs bi-plus-circle"></i>&nbsp; Register
        Transaction
      </button>
</template>
  