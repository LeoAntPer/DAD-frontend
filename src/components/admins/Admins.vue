<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted, inject, computed } from 'vue'
import AdminTable from './AdminTable.vue'
import { useToast } from 'vue-toast-notification';

const toast = useToast()
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

const createAdmin = () => {
  router.push({ name: 'NewAdmin'})
}

const editUser = (admin) => {
  router.push({ name: 'Admin', params: { id: admin.id } })
}

const deletedAdmin = async (admin) => {
  const isConfirmed = window.confirm('Are you sure you want to delete Admin ' + admin.id + '?');

if(isConfirmed) {
  try {
    const response = await axios.delete('/users/' + admin.id)
    const deletedAdmin = response.data.data
    toast.info('Admin ' + deletedAdmin.id + ' was deleted')
    loadUsers()
    
  }
  catch(error) {
    console.log(error)
    toast.error('Error occurred while deleting Admin')
  }
}
}

const totalAdmins = computed( () => {
  return admins.value.length
})

onMounted(() => {
  loadUsers()
})
</script>

<template>
  <div class="d-flex justify-content-between">
    <div class="mx-2">
      <h3 class="mt-4">Admins</h3>
    </div>
    <div class="mx-2 total-filtro">
      <h5 class="mt-4">Total: {{ totalAdmins }}</h5>
    </div>
  </div>
  <hr>
  
    <div class="mx-2 mt-2">
      <button
        type="button"
        class="btn btn-success px-4 btn-addtask"
        @click="createAdmin"
      ><i class="bi bi-xs bi-plus-circle"></i>&nbsp; Create New Admin</button>
    </div>
  
  <admin-table :admins="admins" :showId="false" @edit="editUser" @delete="deletedAdmin"></admin-table>
</template>

<style scoped>
.filter-div {
  min-width: 12rem;
}

.total-filtro {
  margin-top: 2.3rem;
}
</style>
