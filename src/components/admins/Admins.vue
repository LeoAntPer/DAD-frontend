<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted, inject } from 'vue'
import AdminTable from './AdminTable.vue'

const axios = inject('axios')
const router = useRouter()

const admins = ref([])

// const totalUsers = computed(() => {
//     return admins.value.length
// })

const loadUsers = async () => {
  try {
    const response = await axios.get('/users')
    admins.value = response.data.data
  } catch (error) {
    console.log(error)
  }
}

const editUser = (admin) => {
  router.push({ name: 'Admin', params: { id: admin.id } })
}

onMounted(() => {
  loadUsers()
})
</script>

<template>
  <h3 class="mt-5 mb-3">Admins</h3>
  <hr />
  <admin-table :admins="admins" :showId="false" @edit="editUser"></admin-table>
</template>

<style scoped>
.filter-div {
  min-width: 12rem;
}

.total-filtro {
  margin-top: 2.3rem;
}
</style>
