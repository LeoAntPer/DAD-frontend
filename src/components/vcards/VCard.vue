<script setup>
import { ref, watch, inject } from 'vue'
import { useUserStore } from '../../stores/user.js'
import VCardDetail from './VCardDetail.vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'

const axios = inject('axios')
const toast = inject('ToastPlugin')
const userStore = useUserStore()
const router = useRouter()
const props = defineProps({
  phone_number: {
    type: Number,
    default: null
  }
})
const newVCard = () => {
  return {
    phone_number: null,
    name: '',
    email: '',
    photo_url: null,
    password: '',
    confirmation_code: '',
    blocked: 0,
    balance: 0,
    max_debit: null,
    custom_options: null,
    custom_data: null
  }
}

const vcard = ref(newVCard())
const errors = ref(null)
const confirmationLeaveDialog = ref(null)

let originalValueStr = ''

const inserting = (phone_number) => !phone_number || phone_number < 0
const loadUser = async (phone_number) => {
  originalValueStr = ''
  errors.value = null
  if (inserting(phone_number)) {
    vcard.value = newVCard()
  } else {
    try {
      const response = await axios.get('/vcards/' + phone_number)
      vcard.value = response.data.data
      originalValueStr = JSON.stringify(vcard.value)
    } catch (error) {
      console.log(error)
    }
  }
}

const save = async (userToSave) => {
  errors.value = null
  if (inserting(props.phone_number)) {
    try {
      const response = await axios.post('/vcards', userToSave)
      vcard.value = response.data.data
      originalValueStr = JSON.stringify(vcard.value)
      toast.success('VCard #' + vcard.value.phone_number + ' was registered successfully.')

      await userStore.login({
              username: vcard.value.email,
              password: userToSave.password
            })
      router.push({ name: 'Dashboard' })
    } catch (error) {
      if (error.response.status == 422) {
        errors.value = error.response.data.errors
        toast.error('VCard was not registered due to validation errors!')
      } else {
        toast.error('VCard was not registered due to unknown server error!')
      }
    }
  } else {
    try {
      const response = await axios.put('vcards/' + props.phone_number, userToSave)
      vcard.value = response.data.data
      originalValueStr = JSON.stringify(vcard.value)
      toast.success('VCard #' + vcard.value.phone_number + ' was updated successfully.')
      if (vcard.value.phone_number == userStore.userId) {
              await userStore.loadUser()
            }

      //socket.emit('updatedUser', user.value)

      router.back()
    } catch (error) {
      if (error.response.status == 422) {
        errors.value = error.response.data.errors
        toast.error('VCard #' + props.phone_number + ' was not updated due to validation errors!')
      } else {
        toast.error('VCard #' + props.phone_number + ' was not updated due to unknown server error!')
      }
    }
  }
}

const updateCode = async (newCode) => {
    errors.value = null
    if(inserting(props.phone_number)) {
        try {
            const response = await axios.put('vcards/' + props.phone_number + '/newCode', newCode)
            vcard.value = response.data.data
        } catch (error) {
            if(error.response.status == 422) {
                toast.error('VCard was not registered due to validation errors!')
            } else {
                toast.error('VCard was not registered due to unknown server error!')
            }
        }
    }
}

const updatePassword = async (newPassword) => {
    errors.value = null
    if(inserting(props.phone_number)) {
        try {
            const response = await axios.put('vcards/' + props.phone_number + '/newPassword', newPassword)
            vcard.value = response.data.data
        } catch (error) {
            if(error.response.status == 422) {
                toast.error('VCard was not registered due to validation errors!')
            } else {
                toast.error('VCard was not registered due to unknown server error!')
            }
        }
    }
}

const cancel = () => {
  originalValueStr = JSON.stringify(vcard.value)
  router.back()
}

watch(
  () => props.phone_number,
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
  let newValueStr = JSON.stringify(vcard.value)
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

  <VCardDetail
    :vcard="vcard"
    :errors="errors"
    :inserting="inserting(phone_number)"
    @save="save"
    @updateCode="updateCode"
    @updatePassword="updatePassword"
    @cancel="cancel"
  ></VCardDetail>
</template>
