<script setup>
import CategoryDetail from './CategoryDetail.vue'

import { useCategoryStore } from '../../stores/category'
import { useUserStore } from '../../stores/user'

import { ref, inject, computed, watch } from 'vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { useToast } from 'vue-toast-notification'

const categoryStore = useCategoryStore()
const userStore = useUserStore()

const router = useRouter()
const toast = useToast()
const axios = inject('axios')

const newCategory = () => { 
  return {
    id: null,
    name: '',
    vcard: userStore.userId,
    type: '',
  }
}

const newDefaultCategory = () => { 
  return {
    id: null,
    name: '',
    type: '',
  }
}

const category = ref(newCategory())
const defaultCategory = ref(newDefaultCategory())
const errors = ref(null)
const confirmationLeaveDialog = ref(null)
// String with the JSON representation after loading the category (new or edit)
let originalValueStr = ''

const loadCategory = async (id) => {
    originalValueStr = ''
    errors.value = null
    if (!id || (id < 0)) {
      if(userStore.userType == 'A')
      {
        defaultCategory.value = newDefaultCategory()
        originalValueStr = JSON.stringify(category.value)
      }
      else
      {
        category.value = newCategory()
        originalValueStr = JSON.stringify(category.value)
      }
      
    } else {
      try {
        if(userStore.userType == 'A')
        {
          const response = await axios.get('defaultCategories/' + id)
          category.value = response.data.data
        }
        else
        {
          const response = await axios.get('categories/' + id)
          category.value = response.data.data
        }
        originalValueStr = JSON.stringify(category.value)
      } catch (error) {
        console.log(error)
      }      
    }
  }

const save = async () => {
  errors.value = null
  if (operation.value == 'insert') {
    try {
      toast.success('Category #' + category.value.id + ' was created successfully.')
      router.back()
    } catch (error) {
      if (error.response.status == 422) {
        errors.value = error.response.data.errors
        toast.error('Category was not created due to validation errors!')
      } else {
        toast.error('Category was not created due to unknown server error!')
      }
    }
  } else {
    try {
      if(userStore.userType == 'A')
          category.value = await categoryStore.updateCategory(category.value)
          originalValueStr = JSON.stringify(category.value)
          toast.success('Category #' + category.value.id + ' was updated successfully.')
          router.back()
      
    } catch (error) {
      if (error.response.status == 422) {
        errors.value = error.response.data.errors
        toast.error('Category #' + props.id + ' was not updated due to validation errors!')
      } else {
        toast.error('Category #' + props.id + ' was not updated due to unknown server error!')
      }
    }
  }
}    

const cancel = () => {
  originalValueStr = JSON.stringify(category.value)
  router.back()
}

const props = defineProps({
    id: {
      type: Number,
      default: null
    }
  })

const operation = computed(() => {
  return (!props.id || props.id < 0) ? 'insert' : 'update'
})

watch(
  () => props.id, 
  (newValue) => {
        loadCategory(newValue)
  }, {
    immediate: true,
  }
)

let nextCallBack = null
const leaveConfirmed = () => {
  if (nextCallBack) {
    nextCallBack()
  }
}

onBeforeRouteLeave((to, from, next) => {
  nextCallBack = null
  let newValueStr = JSON.stringify(category.value)
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
  <CategoryDetail
    :operationType="operation"
    :category="category"
    :errors="errors"
    @save="save"
    @cancel="cancel"
  ></CategoryDetail>
</template>


<style scoped>

</style>