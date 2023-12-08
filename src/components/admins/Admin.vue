<script setup>
import { ref, watch, inject } from 'vue'

import AdminDetail from './AdminDetail.vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'

const axios = inject('axios')
const toast = inject('ToastPlugin')
const router = useRouter()
const props = defineProps({
  id: {
    type: Number,
    default: null
  }
})
const newAdmin = () => {
  return {
    id: null,
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  }
}

const admin = ref(newAdmin())
const errors = ref(null)
const confirmationLeaveDialog = ref(null)

let originalValueStr = ''

const inserting = (id) => !id || id < 0
const loadUser = async (id) => {
  originalValueStr = ''
  errors.value = null
  if (inserting(id)) {
    admin.value = newAdmin()
  } else {
    try {
      const response = await axios.get('/users/' + id)
      admin.value = response.data.data
      originalValueStr = JSON.stringify(admin.value)
    } catch (error) {
      console.log(error)
    }
  }
}

const save = async (userToSave) => {
  errors.value = null
  if (inserting(props.id)) {
    try {
      const response = await axios.post('/users', userToSave)
      admin.value = response.data.data
      originalValueStr = JSON.stringify(admin.value)
      toast.success('User #' + admin.value.id + ' was registered successfully.')

      /*await userStore.login({
              username: user.value.email,
              password: userToSave.password
            })*/
      router.push({ name: 'Dashboard' })
    } catch (error) {
      if (error.response.status == 422) {
        errors.value = error.response.data.errors
        toast.error('User was not registered due to validation errors!')
      } else {
        toast.error('User was not registered due to unknown server error!')
      }
    }
  } else {
    try {
      const response = await axios.put('users/' + props.id, userToSave)
      admin.value = response.data.data
      originalValueStr = JSON.stringify(admin.value)
      toast.success('User #' + admin.value.id + ' was updated successfully.')
      /*if (user.value.id == userStore.userId) {
              await userStore.loadUser()
            }*/

      //socket.emit('updatedUser', user.value)

      router.back()
    } catch (error) {
      if (error.response.status == 422) {
        errors.value = error.response.data.errors
        toast.error('User #' + props.id + ' was not updated due to validation errors!')
      } else {
        toast.error('User #' + props.id + ' was not updated due to unknown server error!')
      }
    }
  }
}

const cancel = () => {
  originalValueStr = JSON.stringify(admin.value)
  router.back()
}

watch(
  () => props.id,
  (newValue) => {
    loadUser(newValue)
  },
  { immediate: true }
)

let nextCallBack = null
const leaveConfirmed = () => {
  if (nextCallBack) {
    nextCallBack()
  }
}

onBeforeRouteLeave((to, from, next) => {
  nextCallBack = null
  let newValueStr = JSON.stringify(admin.value)
  if (originalValueStr != newValueStr) {
    // Some value has changed - only leave after confirmation
    nextCallBack = next
    confirmationLeaveDialog.value.show()
  } else {
    // No value has changed, so we can leave the component without confirming
    next()
  }
})
</script>
<template>
  <confirmation-dialog
    ref="confirmationLeaveDialog"
    confirmationBtn="Discard changes and leave"
    msg="Do you really want to leave? You have unsaved changes!"
    @confirmed="leaveConfirmed"
  >
  </confirmation-dialog>

  <admin-detail
    :admin="admin"
    :errors="errors"
    :inserting="inserting(id)"
    @save="save"
    @cancel="cancel"
  ></admin-detail>
</template>
