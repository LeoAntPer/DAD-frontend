<script setup>
import { useUserStore } from '../../stores/user';

const userStore = useUserStore()

const props = defineProps({
  admins: {
    type: Array,
    default: () => [],
  },
  showId: {
    type: Boolean,
    default: true,
  },
  showEmail: {
    type: Boolean,
    default: true,
  },
  showEditButton: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(["edit","delete"])

const editClick = (admin) => {
  emit("edit", admin)  
}

const deleteAdmin = (admin) => {
  emit("delete", admin)
}

const canViewUserDetail = (id) => {
    return userStore.userId == id
}
</script>

<template>
    <table class="table">
      <thead>
        <tr>
          <th v-if="showId" class="align-middle">#</th>
          <th class="align-middle">Name</th>
          <th v-if="showEmail" class="align-middle">Email</th>
          </tr>
      </thead>
      <tbody>
        <tr v-for="admin in admins" :key="admin.id">
          <td v-if="showId" class="align-middle">{{ admin.id }}</td>
          <td class="align-middle">{{ admin.name }}</td>
          <td v-if="showEmail" class="align-middle">{{ admin.email }}</td>          <td class="text-end align-middle" v-if="showEditButton">
            <div class="d-flex justify-content-end">
              <button
                class="btn btn-xs btn-light"
                @click="editClick(admin)"
                v-if="canViewUserDetail(admin.id)"
              >
                <i class="bi bi-xs bi-pencil"></i>
              </button>

              <button class="btn btn-xs btn-danger" @click="deleteAdmin(admin)">
                <i class="bi bi-xs bi-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </template>
  
  <style scoped>
  button {
    margin-left: 3px;
    margin-right: 3px;
  }
  
  .img_photo {
    width: 3.2rem;
    height: 3.2rem;
  }
  </style>