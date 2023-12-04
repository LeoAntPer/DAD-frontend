<script setup>
import { ref, watch, computed, inject } from "vue";
import avatarNoneUrl from '@/assets/avatar-none.png'
import axios from 'axios'

const serverBaseUrl = inject("serverBaseUrl")

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
  inserting: {
    type: Boolean,
    default: false,
  },
  errors: {
    type: Object,
    required: false,
  },
});

const emit = defineEmits(["save", "cancel"]);

const editingUser = async () => { await axios.get(serverBaseUrl + 'users/1') }

const inputPhotoFile = ref(null)
const editingImageAsBase64 = ref(null)
const deletePhotoOnTheServer = ref(false)

watch(
  () => props.user,
  (newUser) => {
    editingUser.value = newUser
  },
  { immediate: true }
)

const userTitle = computed(()=>{
  if (!editingUser.value) {
    return ''
  }
  return props.inserting ? 'Register a new user' : 'User #' + editingUser.value.id
})

const save = () => {
  const userToSave = editingUser.value
  userToSave.deletePhotoOnServer = deletePhotoOnTheServer.value
  userToSave.base64ImagePhoto = editingImageAsBase64.value
  emit("save", userToSave);
}

const cancel = () => {
  emit("cancel", editingUser.value);
}

</script>
<template>
    <form class="row g-3 needs-validation" novalidate @submit.prevent="save">
      <h3 class="mt-5 mb-3">{{ userTitle }}</h3>
      <hr/>
      <div class="d-flex flex-wrap justify-content-between">
        <div class="w-75 pe-4">
          <div class="mb-3">
            <label for="inputName" class="form-label">Name</label>
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors ? errors['name'] : false }"
              id="inputName"
              placeholder="User Name"
              required
              v-model="editingUser.name"
            />
            <field-error-message :errors="errors" fieldName="name"></field-error-message>
          </div>
  
          <div class="mb-3 px-1">
            <label for="inputEmail" class="form-label">Email</label>
            <input
              type="email"
              class="form-control"
              :class="{ 'is-invalid': errors ? errors['email'] : false }"
              id="inputEmail"
              placeholder="Email"
              required
              v-model="editingUser.email"
            />
            <field-error-message :errors="errors" fieldName="email"></field-error-message>
          </div>
          <div class="d-flex ms-1 mt-4 flex-wrap justify-content-between">
            <div class="mb-3 me-3 flex-grow-1">
              <div class="form-check">
                <input
                  class="form-check-input"
                  :class="{ 'is-invalid': errors ? errors['type'] : false }"
                  type="checkbox"
                  true-value="A"
                  false-value="M"
                  v-model="editingUser.type"
                  id="inputType"
                />
                <label class="form-check-label" for="inputType">
                  User is Administrator
                </label>
              </div>
              <field-error-message :errors="errors" fieldName="type"></field-error-message>
            </div>
            <div class="mb-3 ms-xs-3 flex-grow-1">
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  :class="{ 'is-invalid': errors ? errors['gender'] : false }"
                  type="radio"
                  name="radioGender"
                  value="M"
                  required
                  v-model="editingUser.gender"
                  id="inputGenderM"
                />
                <label class="form-check-label" for="inputGenderM">Masculino</label>
              </div>
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  :class="{ 'is-invalid': errors ? errors['gender'] : false }"
                  type="radio"
                  name="radioGender"
                  value="F"
                  v-model="editingUser.gender"
                  id="inputGenderF"
                />
                <label class="form-check-label" for="inputGenderF">Feminino</label>
              </div>
              <field-error-message :errors="errors" fieldName="gender"></field-error-message>
            </div>
          </div>
          <div class="mb-3" v-if="inserting">
            <label for="inputPassword" class="form-label">Password</label>
            <input
                type="password"
                class="form-control"
                :class="{ 'is-invalid': errors ? errors['password'] : false }"
                id="inputPassword"
                v-model="editingUser.password"
            />
            <field-error-message :errors="errors" fieldName="password"></field-error-message>
          </div>
          <div class="mb-3"  v-if="inserting">
            <label for="inputPasswordConfirmation" class="form-label">Password Confirmation</label>
            <input
                type="password"
                class="form-control"
                :class="{ 'is-invalid': errors ? errors['password_confirmation'] : false }"
                id="inputPasswordConfirmation"
                v-model="editingUser.password_confirmation"
            />
            <field-error-message :errors="errors" fieldName="password_confirmation"></field-error-message>
          </div>
        </div>
      </div>
      <hr/>
      <div class="mt-2 d-flex justify-content-end">
        <button type="button" class="btn btn-primary px-5 mx-2" @click="save">Save</button>
        <button type="button" class="btn btn-light px-5 mx-2" @click="cancel">Cancel</button>
      </div>
    </form>
    <input type="file" style="visibility:hidden;" id="inputPhoto" ref="inputPhotoFile" @change="changePhotoFile" />
  </template>
