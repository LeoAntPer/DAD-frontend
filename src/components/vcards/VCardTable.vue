<script setup>
import { inject } from 'vue'
import { useUserStore } from '../../stores/user';
import avatarNoneUrl from '@/assets/avatar-none.png'

const serverBaseUrl = inject('serverBaseUrl')
const userStore = useUserStore()

const props = defineProps({
    vcards: {
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
    showPhoto: {
        type: Boolean,
        default: true,
    },
    showEditButton: {
        type: Boolean,
        default: true,
    },
})

const emit = defineEmits(["edit"])

const photoFullUrl = (vcard) => {
    return vcard.photo_url
    ? serverBaseUrl + "/storage/fotos/" + vcard.photo_url
    : avatarNoneUrl
}

const editClick = (vcard) => {
    emit("edit", vcard)
}

const canViewUserDetail = (userId) => {
    if(!userStore.user){
        return false
    }
    return userStore.userType == 'A' || userStore.userId == userId
}
</script>

<template>
    <table class="table">
      <thead>
        <tr>
          <th v-if="showId" class="align-middle">#</th>
          <th v-if="showPhoto" class="align-middle">Photo</th>
          <th class="align-middle">Name</th>
          <th v-if="showEmail" class="align-middle">Email</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="vcard in vcards" :key="vcard.id">
          <td v-if="showId" class="align-middle">{{ vcard.id }}</td>
          <td v-if="showPhoto" class="align-middle">
            <img :src="photoFullUrl(vcard)" class="rounded-circle img_photo" />
          </td>
          <td class="align-middle">{{ vcard.name }}</td>
          <td v-if="showEmail" class="align-middle">{{ vcard.email }}</td>
          <td class="text-end align-middle" v-if="showEditButton">
            <div class="d-flex justify-content-end" v-if="canViewUserDetail(vcard.phone_number)">
              <button
                class="btn btn-xs btn-light"
                @click="editClick(vcard)"
                v-if="showEditButton"
              >
                <i class="bi bi-xs bi-pencil"></i>
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